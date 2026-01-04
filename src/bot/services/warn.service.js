import fs from 'fs';
import path from 'path';


// Utworzenie scieżki i pliku
const DATA_PATH = path.join('data', 'warning.json');

// Ilość ostrzeżen inaczej Ban
const MAX_WARNINGS = 3;

// Sprawdzenie czy plik istnieje
function ensureFile() {
    if (!fs.existsSync('data')) {
        fs.mkdirSync('data');
    }

    if (!fs.existsSync(DATA_PATH)) {
        fs.writeFileSync(DATA_PATH, JSON.stringify({}, null, 2));
    }
};

// Funckja wczytania danych z pliku
function loadData() {
    ensureFile();
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
};

// Funkcja zapisania danych do pliku
function saveData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

// Wysyłanie użytkownikowi ostrzeżenia w prywatnej wiadomości i zapisanie ilości i powodu ostrzeżenia
export async function addWarning({ guildId, guildName, member, reason, lang}) {
    const data = loadData();

    if(!data[guildId]) data[guildId] = {}
    if(!data[guildId][member.id]) {
        data[guildId][member.id] = {
            count: 0,
            reasons: [],
        };
    }

    data[guildId][member.id].count += 1;
    data[guildId][member.id].reasons.push(reason)

    const warningCount = data[guildId][member.id].count;

    saveData(data)

// Próbowa wysłania ostrzeżenia na PW, osiągniecie max ostrzeżeń = ban użytkownika
try {
    await member.send(
        lang === 'pl'
            ? `# :warning: Otrzymałeś ostrzeżenie na serwerze  ${guildName}, otrzymanie 3 ostrzeżeń będzie skutkowało **BANEM!** \n` + 
            `## Posiadasz: **${data[guildId][member.id].count}** ostrzeżenia!\n` + 
            `Powód ostrzeżenia: **"${reason}"**`
            : `# :warning: You've been warned on ${guildName}, getting 3 warnings results getting **Banned!** \n` + 
            `## Warning count: **${data[guildId][member.id].count}**\n` + 
            `Reason: **"${reason}"**`
    )
} catch {
    console.warn(`Nie udało się wysłać ostrzeżenia do ${member.user.tag}`);
}  

if (warningCount >= MAX_WARNINGS) {
    try {
        await member.send(
            lang === 'pl'
            ? `# :no_entry: Zostałeś zbanowany na serwerze: **${guildName}**\n` +
            `Ilość ostrzeżeń: **${MAX_WARNINGS}**. Powód: **${reason}**`
            : `# :no_entry: You have been banned from: **${guildName}** for too many violations! Max: **${MAX_WARNINGS}**\n` +
            `Last reason: **${reason}**`
        );
        // eslint-disable-next-line no-empty
    } catch {}
    
    try {
        await member.ban({
            reason: `Auto Ban, You've got to many warnings. Count: ${MAX_WARNINGS}`,
        });

        delete data[guildId][member.id];
        saveData(data)
        
        return {
            count: warningCount,
            banned: true,
        };
    } catch (error) {
        console.error(`Nie udało się zbanować ${member.user.tag}`, error);
    }
}

return {
    count: warningCount,
        banned: false,
    };
}


