npx jest src/testcase.test.js --json --outputFile=testresult.json
node -e "const fs=require('fs');const r=JSON.parse(fs.readFileSync('testresult.json'));const rows=[['name','status','title']];r.testResults.forEach(s=>s.assertionResults.forEach(a=>rows.push([s.name,a.status,a.title])));fs.writeFileSync('testresult.csv',rows.map(e=>e.join(',')).join('`n'))"
npx jest src/testcase.test.js --json --outputFile=testresult.json
node -e "const fs=require('fs');const r=JSON.parse(fs.readFileSync('testresult.json'));const rows=[['name','status','title']];r.testResults.forEach(s=>s.assertionResults.forEach(a=>rows.push([s.name,a.status,a.title])));fs.writeFileSync('testresult.csv',rows.map(e=>e.join(',')).join('\n'))"
