const getGithubUserActivity = async (username) => {
    const url = `https://api.github.com/users/${username}/events`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const events = await response.json();
        displayActivity(events);
    } catch (error) {
        console.log("Error getting github user activities. " + error);
    }
};

const displayActivity = (events) => {
    if (events.length === 0) {
        console.log("No recent activity found.");
        return;
    }

    events.slice(0, 10).forEach((event) => {
        let action;
        switch (event.type) {
            case "PushEvent":
                const commitCount = event.payload.commits.length;
                action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
                break;
            case "IssuesEvent":
                action = `${
                    event.payload.action.charAt(0).toUpperCase() +
                    event.payload.action.slice(1)
                } an issue in ${event.repo.name}`;
                break;
            case "WatchEvent":
                action = `Starred ${event.repo.name}`;
                break;
            case "ForkEvent":
                action = `Forked ${event.repo.name}`;
                break;
            case "CreateEvent":
                action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
                break;
            default:
                action = `${event.type.replace("Event", "")} in ${
                    event.repo.name
                }`;
                break;
        }
        console.log(
            `- ${action} (${new Date(event.created_at).toLocaleString()})`
        );
    });
};

// CLI
const username = process.argv[2];
if (!username) {
    console.log("Please provide a Github username.");
} else {
    getGithubUserActivity(username);
}
