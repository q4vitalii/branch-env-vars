import * as core from "@actions/core";

const protectedEnvVars = [
  "INPUT_BEVOVERWRITE",
  "INPUT_BEVACTIONONNOREF",
  "INPUT_BEVSETEMPTYVARS",
];

let canOverwrite;
let noRefAction;
let setEmptyVars;

function parseBranchName(ref) {
  if (!ref) {
    switch (noRefAction) {
      case "error":
        core.setFailed("Unable to get github.ref/GITHUB_REF");
        return;
      case "warn":
        core.warning("Unable to get github.ref/GITHUB_REF");
        break;
      case "continue":
        break;
      default:
        core.setFailed(`Invalid value for bevActionOnNoRef: ${noRefAction}`);
        return;
    }
  }
  // should look like [heads, my-branch-name] or [pulls, my-pull] or [tags, v0.0.0]
  const [refType, refSourceName] = ref.replace("refs/", "").split("/");

  /* workflow yaml with:
  TEST_ENV_VAR: |
    master:someValueForMaster
    staging:someValueForStaging
    !pr:someValueForAPR
    !tag:someValueForTags
    !default:someDefaultValue
   */

  let branchName = "!default";

  switch (refType) {
    case "heads":
      branchName = refSourceName;
      break;
    case "pulls":
      branchName = "!pr";
      break;
    case "tags":
      branchName = "!tag";
      break;
  }

  return branchName;
}

function checkWildcardNames(branchName, possibleValues) {
  let reg = null
  core.debug('BEFORE POS VALUES = ', Object.keys(possibleValues))
  const match = Object.keys(possibleValues).filter((key) => { 
      core.debug("---> Checking %s VS %s=%s", branchName, key)
      if (key.indexOf('*') !== -1) { 
        reg = new RegExp(key.replace("*",".*?"));
        if (reg.test(branchName)) {
          core.debug("---> !!! MATCH FOUND %s VS %s", branchName, key)
          return true
        }
      }
  })

  return (match[0] && possibleValues[match[0]]) || null
}

function parseEnvVarPossibilities(envVars) {
  return Object.entries(envVars)
    .filter(
      ([name]) => name.startsWith("INPUT_") && !protectedEnvVars.includes(name)
    )
    .map(([name, value]) => {
      // name of the environment variable
      const transformedName = name.replace("INPUT_", "");

      // handle static environment variables
      if (!value.includes("\n")) {
        return [
          transformedName,
          {
            "!default": value.trim(),
          },
        ];
      }

      /*
      {
        "master": "someValueForMaster",
        "staging": "someValueForStaging",
        // ...
      }
       */
      const possibleValues = value.split("\n").reduce((acc, pair) => {
        // comment or empty line
        if (pair.trim().startsWith("#") || !pair.trim().length) {
          return acc;
        }

        const separatorLoc = pair.indexOf(":");
        if (separatorLoc === -1) {
          throw new Error(
            `Invalid value for ${transformedName}: ${pair} does not contain a colon`
          );
        }

        // what environment variable name the values are for
        const valueFor = pair.substring(0, separatorLoc).trim();

        acc[valueFor] = pair.substring(separatorLoc + 1);

        return acc;
      }, {});

      return [transformedName, possibleValues];
    });
}

try {
  canOverwrite = core.getInput("bevOverwrite") === "true";
  noRefAction = core.getInput("bevActionOnNoRef");
  setEmptyVars = core.getInput("bevSetEmptyVars") === "true";

  const ref = process.env.GITHUB_REF;
  const branchName = parseBranchName(ref);

  const vars = parseEnvVarPossibilities(process.env).forEach(
    ([name, possibleValues]) => {
      if (!canOverwrite && !!process.env[name]) {
        return;
      }
      core.debug("---> Checking wildcard")      
      const wildcard = checkWildcardNames(branchName, possibleValues)
      const value = possibleValues[branchName] || wildcard || possibleValues["!default"];
      if (!value) {
        if (setEmptyVars) {
          core.exportVariable(name, "");
          core.debug(`Exporting ${name} with an empty value`);
        }
      } else {
        core.exportVariable(name, value);
        core.debug(`Exporting ${name} with value ${value}`);
      }
    }
  );
} catch (e) {
  core.setFailed(e);
}
