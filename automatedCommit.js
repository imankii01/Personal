const cron = require("node-cron");
const fs = require("fs-extra");
const path = require("path");
const simpleGit = require("simple-git");

// Git config
const git = simpleGit();
const repoPath = "./"; // Set to root directory of the local Git repository
const commitMessage = "Automated commit with random content";

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

// Function to create a new file with random content
const createRandomFile = () => {
    const fileName = `file_${Date.now()}.js`;
    const filePath = path.join(repoPath, fileName);
    const content = generateRandomContent();
    fs.writeFileSync(filePath, content);
    console.log(`File created: ${fileName}`);
    return fileName;
};

// Function to commit and push changes
const commitAndPushChanges = async () => {
    try {
        console.log("Starting to add files...");

        // Stage all files in the repository
        await git.add("./*");
        console.log("Files successfully staged.");

        // Commit the staged changes
        console.log("Starting commit...");
        await git.commit(commitMessage);
        console.log("Commit successful.");

        // Push the committed changes to the remote repository
        console.log("Starting push to remote repository...");
        await git.push("origin", "main"); // Replace 'main' with the correct branch name if needed
        console.log("Push successful. Changes committed and pushed to GitHub.");

    } catch (err) {
        console.error("Error during commit and push process:", err);
    }
};


// Schedule task to run every 10 seconds
cron.schedule("*/10 * * * * *", async () => {
    console.log("Scheduled task started");

    // Create a single file (or adjust if multiple files are desired)
    createRandomFile();

    // Commit and push changes
    await commitAndPushChanges();
});

console.log("Automation script is running every 10 seconds.");
