const fs = require("fs-extra");
const path = require("path");
const simpleGit = require("simple-git");
const git = simpleGit();
const repoPath = "./";
const commitMessage = "Automated commit with random content";

const generateRandomContent = () => {
  const lines = [
    "console.log('Hello World!');",
    "const x = Math.random();",
    "console.log('Random value:', x);",
    "function greet(name) { return `Hello, ${name}!`; }",
    "// Some random comment",
    "let today = new Date();",
  ];
  return lines[Math.floor(Math.random() * lines.length)];
};

const createRandomFile = () => {
  const fileName = `file_${Date.now()}.js`;
  const filePath = path.join(repoPath, fileName);
  const content = generateRandomContent();
  fs.writeFileSync(filePath, content);
  console.log(`File created: ${fileName}`);
  return fileName;
};

const commitAndPushChanges = async () => {
  try {
    console.log("Checking for existing lock...");
    if (fs.existsSync(path.join(repoPath, ".git", "index.lock"))) {
      console.log("Git is locked, retrying in 5 seconds...");
      setTimeout(commitAndPushChanges, 5000);
      return;
    }

    console.log("Staging files...");
    await git.add("./*");
    console.log("Committing changes...");
    await git.commit(commitMessage);
    console.log("Pushing to repository...");
    await git.push("origin", "main");
    console.log("Changes committed and pushed.");
  } catch (error) {
    console.error("Error during commit and push:", error);
  }
};

(async () => {
  console.log("Running scheduled automation script.");
  createRandomFile();
  await commitAndPushChanges();
})();
