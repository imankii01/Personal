const cron = require("node-cron");
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

const isGitLocked = () => {
  return fs.existsSync(path.join(repoPath, ".git", "index.lock"));
};

const commitAndPushChanges = async () => {
  try {
    if (isGitLocked()) {
      console.log("Git is locked, retrying after 5 seconds...");
      setTimeout(commitAndPushChanges, 5000);
      return;
    }

    console.log("Starting to add files...");

    await git.add("./*");
    console.log("Files successfully staged.");
    console.log("Starting commit...");
    await git.commit(commitMessage);
    console.log("Commit successful.");

    console.log("Starting push to remote repository...");
    await git.push("origin", "main");
    console.log("Push successful. Changes committed and pushed to GitHub.");
  } catch (err) {
    console.error("Error during commit and push process:", err);
  }
};

cron.schedule("0 8 * * *", async () => {
  console.log("Scheduled task started at 8 AM");
  createRandomFile();
  await commitAndPushChanges();
});

cron.schedule("0 11 * * *", async () => {
  console.log("Scheduled task started at 11 AM");
  createRandomFile();
  await commitAndPushChanges();
});

cron.schedule("0 14 * * *", async () => {
  console.log("Scheduled task started at 2 PM");
  createRandomFile();
  await commitAndPushChanges();
});

// Schedule at 5 PM
cron.schedule("0 17 * * *", async () => {
  console.log("Scheduled task started at 5 PM");
  createRandomFile();
  await commitAndPushChanges();
});

cron.schedule("0 20 * * *", async () => {
  console.log("Scheduled task started at 8 PM");
  createRandomFile();
  await commitAndPushChanges();
});
   
console.log(
  "Scheduled task set to run 5 times a day at 8 AM, 11 AM, 2 PM, 5 PM, and 8 PM."
);
    
console.log("Automation script is running every 160 seconds.");
