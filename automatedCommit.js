const fs = require("fs-extra");
const path = require("path");
const simpleGit = require("simple-git");

// Git and repository configuration
const git = simpleGit();
const repoPath = path.resolve(__dirname); // Ensure it points to the repo root
const commitMessage = "Automated commit with random content";
const targetDir = path.join(repoPath, "file"); // Directory where files are created

// Utility function to generate random content
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

// Ensure target directory exists
fs.ensureDirSync(targetDir);

// Function to create a new file with random content
const createRandomFile = () => {
  const fileName = `file_${Date.now()}.js`;
  const filePath = path.join(targetDir, fileName);
  const content = generateRandomContent();
  fs.writeFileSync(filePath, content);
  console.log(`File created: ${fileName}`);
  return fileName;
};

// Function to commit and push changes
const commitAndPushChanges = async () => {
  try {
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

// Main function to create a file, commit, and push
(async () => {
  try {
    // Check for .git/index.lock file to prevent git locking conflicts
    const lockFilePath = path.join(repoPath, ".git", "index.lock");
    if (fs.existsSync(lockFilePath)) {
      console.log("Git is locked, retrying in 5 seconds...");
      setTimeout(async () => {
        await commitAndPushChanges();
      }, 5000);
    } else {
      console.log("Running scheduled automation script.");
      createRandomFile();
      await commitAndPushChanges();
    }
  } catch (error) {
    console.error("An error occurred in the main function:", error);
  }
})();
