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

const commitAndPushChanges = async () => {
    try {
        await git.add("./*");
        await git.commit(commitMessage);
        await git.push("origin", "main");
        console.log("Changes committed and pushed.");
    } catch (err) {
        console.error("Error committing or pushing changes:", err);
    }
};

cron.schedule("0 9 * * *", async () => {
    console.log("Daily task started");

    const fileCount = Math.floor(Math.random() * 2) + 3;
    for (let i = 0; i < fileCount; i++) {
        createRandomFile();
    }

    await commitAndPushChanges();
});

console.log("Automation script is running.");
