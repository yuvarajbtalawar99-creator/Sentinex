const fs = require('fs');
const path = require('path');

const files = [
    'server/services/WeeklySummaryService.ts',
    'server/services/RiskEngine.ts',
    'server/services/OrgAggregationService.ts',
    'server/services/InsightEngine.ts',
    'server/services/ForecastingEngine.ts',
    'server/services/AlertEngine.ts',
    'server/seed.ts',
    'server/routes/org.ts',
    'server/routes/dashboard.ts'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');

        // Simple replacements
        content = content.replace(/moodScore/g, 'intensity');
        content = content.replace(/emotionType/g, 'mood');

        // Specific complex replacements
        content = content.replace(
            /sentimentScore:\s*log\.sentimentScore\s*\|\|\s*0/g,
            "sentimentScore: log.aiInsights?.sentiment === 'positive' ? 1 : log.aiInsights?.sentiment === 'negative' ? -1 : 0"
        );
        content = content.replace(
            /sentimentScore:\s*\(score\s*-\s*5\)\s*\/\s*5/g,
            "aiInsights: { sentiment: score > 5 ? 'positive' : score < 5 ? 'negative' : 'neutral' }"
        );

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
});
