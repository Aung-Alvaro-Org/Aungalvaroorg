export default async function handler(req, res) {
    try {
        const { text } = JSON.parse(req.body);

        const response = await fetch("https://api.openai.com/v1/moderations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "omni-moderation-latest",
                input: text,
            }),
        });

        const data = await response.json();
        const flagged = data.results?.[0]?.flagged === true;

        res.status(200).json({ flagged });
    } catch (e) {
        res.status(500).json({ error: "Moderation failed" });
    }
}
