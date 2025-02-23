import { scrapeWebPage } from './scrapper/scrapper.js';
import fs from 'node:fs';

const url = 'https://edu.info.uaic.ro/orar/orar_complet.html';

function columnMapper(number) {
    switch (number) {
        case 0:
            return 'Ora';
        case 1:
            return 'Grupa';
        case 2:
            return 'Disciplina';
        case 3:
            return 'Tip';
        case 4:
            return 'Profesor';
        case 5:
            return 'Sala';
        case 6:
            return 'Paritate';
        default:
            return 'Unknown';
    }
}

scrapeWebPage(url).then((webPage) => {
    if (webPage) {
        const data = {};

        webPage('h2').each((_, element) => {
            const heading = webPage(element).text();
            const table = webPage(element).next('table');
            const rows = {};

            let key = '';
            let value = [];

            table.find('tr').each((_, row) => {
                const columns = webPage(row).find('td');

                if (columns.length === 1) {
                    if (key !== '') {
                        rows[key] = value;
                    }

                    key = webPage(columns).text().trim();
                    value = [];
                } else {
                    const temp_val = {};
                    for (let i = 0; i < columns.length; i++) {
                        temp_val[columnMapper(i)] = webPage(columns[i]).text().trim();
                    }
                    value.push(temp_val);
                }
            });

            if (key !== '') {
                rows[key] = value;
            }

            data[heading] = rows;
        });

        fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Data saved successfully.');
            }
        });

        // fs.writeFile('webPage.html', webPage.html(), (err) => {
        //     if (err) {
        //         console.error('Error writing file:', err);
        //     } else {
        //         console.log('Web page saved successfully.');
        //     }
        // });
    }
});