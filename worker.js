// Hochstapler: Cloudflare Worker + Durable Object (Klasse Room, Binding ROOMS, Secret PASSWORT)
const WV = '6.11.-16';
const H = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'content-type': 'application/json' };
const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: H });
const CATS=[
{id:"essen",n:"Essen & Trinken",e:"🍕",w:[["Pizza", "Apfel", "Brot", "Käse", "Nudeln", "Kuchen", "Schokolade", "Banane", "Kartoffel", "Milch", "Wasser", "Ei", "Suppe", "Reis", "Wurst", "Eis", "Tomate", "Kaffee", "Orange", "Butter", "Birne", "Salz", "Zucker", "Mehl", "Saft", "Gemüse", "Obst", "Keks", "Brötchen", "Bonbon"],["Lasagne", "Pfannkuchen", "Gurke", "Joghurt", "Müsli", "Brezel", "Limonade", "Honig", "Spaghetti", "Hamburger", "Pommes", "Erdbeere", "Marmelade", "Salat", "Currywurst", "Schnitzel", "Rührei", "Tee", "Cola", "Zitrone", "Waffel", "Popcorn", "Pudding", "Möhre", "Paprika", "Zwiebel", "Knoblauch", "Pilze", "Kirsche", "Pfirsich"],["Risotto", "Sauerkraut", "Fondue", "Baguette", "Quark", "Sushi", "Mettbrötchen", "Kartoffelsalat", "Gulasch", "Rosinen", "Ketchup", "Muffin", "Zimtschnecke", "Bratwurst", "Camembert", "Sauerbraten", "Brokkoli", "Haferflocken", "Maultaschen", "Knödel", "Rhabarber", "Aubergine", "Spargel", "Tiramisu", "Falafel", "Croissant", "Bulette", "Hummus", "Mozzarella", "Pesto"]]},
{id:"tiere",n:"Tiere",e:"🐶",w:[["Hund", "Katze", "Pferd", "Kuh", "Schwein", "Vogel", "Fisch", "Hase", "Maus", "Ente", "Löwe", "Elefant", "Affe", "Bär", "Schaf", "Huhn", "Frosch", "Schmetterling", "Biene", "Giraffe", "Tiger", "Esel", "Hamster", "Taube", "Wurm", "Schnecke", "Ameise", "Wespe", "Krebs", "Kaninchen"],["Pinguin", "Delfin", "Krokodil", "Eichhörnchen", "Igel", "Fuchs", "Wolf", "Papagei", "Schildkröte", "Känguru", "Zebra", "Nilpferd", "Hai", "Eule", "Hirsch", "Marienkäfer", "Spinne", "Adler", "Gans", "Ziege", "Wal", "Robbe", "Kamel", "Leopard", "Gorilla", "Schwan", "Storch", "Specht", "Mücke", "Hummel"],["Faultier", "Chamäleon", "Seepferdchen", "Stachelschwein", "Dachs", "Flamingo", "Waschbär", "Biber", "Nashorn", "Krake", "Glühwürmchen", "Libelle", "Maulwurf", "Pfau", "Qualle", "Otter", "Luchs", "Wiesel", "Ameisenbär", "Salamander", "Pangolin", "Axolotl", "Tapir", "Erdmännchen", "Fledermaus", "Kormoran", "Sperber", "Seeigel", "Kakerlake", "Gürteltier"]]},
{id:"laender",n:"Länder & Städte",e:"🌍",w:[["Deutschland", "Italien", "Spanien", "Frankreich", "Berlin", "Paris", "London", "Österreich", "Schweiz", "Amerika", "China", "Rom", "Hamburg", "München", "Türkei", "Griechenland", "Japan", "Australien", "Wien", "Köln", "Russland", "Bremen", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig", "Belgien", "Dänemark", "Holland", "Ungarn"],["Portugal", "Norwegen", "Ägypten", "Kanada", "Brasilien", "Venedig", "Barcelona", "Amsterdam", "Prag", "Dubai", "Mexiko", "Indien", "Island", "Schweden", "Madrid", "Istanbul", "New York", "Kairo", "Dresden", "Polen", "Athen", "Moskau", "Tokio", "Peking", "Südafrika", "Irland", "Schottland", "Nürnberg", "Mailand", "Zürich"],["Neuseeland", "Marokko", "Argentinien", "Budapest", "Kopenhagen", "Lissabon", "Edinburgh", "Peru", "Kenia", "Vietnam", "Thailand", "Singapur", "Helsinki", "Salzburg", "Hannover", "Rotterdam", "Sevilla", "Florenz", "Kroatien", "Finnland", "Tansania", "Kolumbien", "Chile", "Estland", "Lettland", "Litauen", "Slowenien", "Bologna", "Krakau", "Bratislava"]]},
{id:"orte",n:"Orte",e:"📍",w:[["Schule", "Park", "Bahnhof", "Supermarkt", "Kino", "Schwimmbad", "Spielplatz", "Krankenhaus", "Bäckerei", "Zoo", "Küche", "Garten", "Kirche", "Flughafen", "Bibliothek", "Restaurant", "Büro", "Café", "Museum", "Wohnzimmer", "Bad", "Schlafzimmer", "Bauernhof", "Theater", "Gasthaus", "Post", "Bank", "Eisdiele", "Metzgerei", "Spielhalle"],["Rathaus", "Friedhof", "Tankstelle", "Zirkus", "Apotheke", "Fitnessstudio", "Hafen", "Leuchtturm", "Campingplatz", "Stadion", "Disco", "Friseursalon", "Waschsalon", "Brücke", "Marktplatz", "Burg", "Dachboden", "Keller", "Parkplatz", "Gefängnis", "Werkstatt", "Fabrik", "Garage", "Turnhalle", "Kindergarten", "Universität", "Polizeiwache", "Feuerwache", "Autobahn", "Tunnel"],["Observatorium", "Aquarium", "Kegelbahn", "Kloster", "Bergwerk", "Hochhaus", "Raststätte", "Sauna", "Jahrmarkt", "Tierheim", "Kaserne", "Kiosk", "Planetarium", "Windmühle", "Schrebergarten", "Reitstall", "Skatepark", "Wochenmarkt", "Hütte", "Kneipe", "Steinbruch", "Gewächshaus", "Sternwarte", "Kapelle", "Pfarrhaus", "Gerichtssaal", "Kornspeicher", "Seniorenheim", "Wartesaal", "Umkleidekabine"]]},
{id:"berufe",n:"Berufe",e:"👷",w:[["Arzt", "Lehrer", "Bäcker", "Polizist", "Feuerwehrmann", "Koch", "Friseur", "Busfahrer", "Pilot", "Maler", "Verkäufer", "Gärtner", "Sänger", "Zahnarzt", "Postbote", "Metzger", "Tierarzt", "Schreiner", "Bauer", "Kellner", "Bauarbeiter", "Fahrer", "Soldat", "Reporter", "Kapitän", "Pfarrer", "Sekretärin", "Putzfrau", "Fischer", "Schneider"],["Elektriker", "Klempner", "Architekt", "Journalist", "Fotograf", "Schauspieler", "Mechaniker", "Richter", "Anwalt", "Krankenpfleger", "Dachdecker", "Schornsteinfeger", "Optiker", "Florist", "Tänzer", "Astronaut", "Detektiv", "Förster", "Programmierer", "Hausmeister", "Bankkaufmann", "Apotheker", "Physiker", "Chemiker", "Erzieher", "Sportlehrer", "Musiker", "Zimmermann", "Maurer", "Taxifahrer"],["Archäologe", "Dolmetscher", "Gerichtsvollzieher", "Bestatter", "Goldschmied", "Imker", "Dirigent", "Steuerberater", "Ingenieur", "Rettungsschwimmer", "Taucher", "Zollbeamter", "Bibliothekar", "Hebamme", "Konditor", "Lokführer", "Sanitäter", "Fliesenleger", "Tätowierer", "Kartograf", "Notar", "Psychologe", "Logopäde", "Restaurator", "Sattler", "Bootsbauer", "Glaser", "Fremdenführer", "Auktionator", "Stuckateur"]]},
{id:"sport",n:"Sport",e:"⚽",w:[["Fußball", "Tennis", "Schwimmen", "Laufen", "Radfahren", "Basketball", "Handball", "Volleyball", "Turnen", "Skifahren", "Tischtennis", "Boxen", "Reiten", "Golf", "Eishockey", "Wandern", "Rudern", "Judo", "Yoga", "Bowling", "Joggen", "Zumba", "Skaten", "Karate", "Paddeln", "Fitness", "Aerobic", "Eislaufen", "Rollschuhlaufen", "Seilspringen"],["Badminton", "Rugby", "Segeln", "Surfen", "Klettern", "Fechten", "Ringen", "Snowboard", "Eiskunstlauf", "Bogenschießen", "Leichtathletik", "Hochsprung", "Kegeln", "Squash", "Triathlon", "Skateboard", "Kanu", "Gewichtheben", "Biathlon", "Rodeln", "Weitsprung", "Kugelstoßen", "Diskuswurf", "Marathon", "Hürdenlauf", "Sprint", "Taekwondo", "Tauchen", "Paragliding", "Crossfit"],["Curling", "Speerwurf", "Hammerwurf", "Stabhochsprung", "Kunstturnen", "Wasserball", "Synchronschwimmen", "Dressurreiten", "Bobfahren", "Skispringen", "Eisschnelllauf", "Kitesurfen", "Orientierungslauf", "Hindernislauf", "Sumo", "Lacrosse", "Polo", "Cricket", "Baseball", "Bouldern", "Zehnkampf", "Siebenkampf", "Floorball", "Dreisprung", "Rhythmische Gymnastik", "Eisstockschießen", "Slackline", "Tauziehen", "Skeleton", "Nordic Walking"]]},
{id:"hobbys",n:"Hobbys",e:"🎨",w:[["Lesen", "Malen", "Zeichnen", "Kochen", "Backen", "Gärtnern", "Fotografieren", "Basteln", "Stricken", "Angeln", "Singen", "Tanzen", "Schach", "Puzzeln", "Nähen", "Sammeln", "Töpfern", "Camping", "Zaubern", "Musizieren", "Spazieren", "Rätseln", "Kartenspielen", "Zocken", "Tagebuch schreiben", "Flohmarktbummeln", "Filmeabend", "Wellness", "Grillen", "Fernsehen"],["Häkeln", "Origami", "Briefmarken", "Münzsammeln", "Modellbau", "Schreiben", "Bloggen", "Schnitzen", "Geocaching", "Vogelbeobachtung", "Sudoku", "Kreuzworträtsel", "Karaoke", "Brettspiele", "Heimwerken", "Kalligrafie", "Makramee", "Bügelperlen", "Sternegucken", "Kerzenziehen", "Aquarellmalen", "Ahnenforschung", "Stickerei", "Seifensieden", "Pilzesammeln", "Legobauen", "Podcasts hören", "Brotbacken", "Sprachenlernen", "Kochkurs"],["Falknerei", "Bonsai", "Scrapbooking", "Cosplay", "Jonglieren", "Pantomime", "Drohnenfliegen", "Mineraliensammeln", "Schmieden", "Glasbläserei", "Weinverkostung", "Modelleisenbahn", "Imkerei", "Oldtimerpflege", "Seidenmalerei", "Linoldruck", "Patchwork", "Kakteenzucht", "Aquaristik", "Fossiliensuche", "Lederarbeit", "Buchbinden", "Orchideenzucht", "Segelfliegen", "Astrofotografie", "Radierung", "Lackmalerei", "Perlenweben", "Schattenspiel", "Zinngießen"]]},
{id:"haushalt",n:"Haushalt",e:"🏠",w:[["Tisch", "Stuhl", "Bett", "Sofa", "Lampe", "Teller", "Gabel", "Löffel", "Messer", "Tasse", "Besen", "Eimer", "Schrank", "Spiegel", "Teppich", "Kissen", "Decke", "Herd", "Kühlschrank", "Dusche", "Glas", "Topf", "Fenster", "Tür", "Schlüssel", "Uhr", "Bürste", "Bilderrahmen", "Sessel", "Toilette"],["Staubsauger", "Waschmaschine", "Toaster", "Bügeleisen", "Wasserkocher", "Geschirrtuch", "Mülleimer", "Kochtopf", "Pfanne", "Sieb", "Kerze", "Vorhang", "Handtuch", "Zahnbürste", "Seife", "Wecker", "Regal", "Badewanne", "Spüle", "Schwamm", "Backofen", "Mikrowelle", "Wäschekorb", "Kaffeemaschine", "Putzlappen", "Kleiderschrank", "Nachttisch", "Wandregal", "Tischdecke", "Bettdecke"],["Spülmaschine", "Dosenöffner", "Kartoffelstampfer", "Nudelholz", "Reibe", "Schneebesen", "Fusselrolle", "Wäscheklammer", "Türstopper", "Schuhlöffel", "Kleiderbügel", "Bügelbrett", "Eierbecher", "Salzstreuer", "Fliegenklatsche", "Kehrschaufel", "Thermoskanne", "Untersetzer", "Korkenzieher", "Flaschenöffner", "Backpinsel", "Käsehobel", "Knoblauchpresse", "Eierschneider", "Zitruspresse", "Teesieb", "Trichter", "Schöpfkelle", "Pfannenwender", "Küchenwaage"]]},
{id:"natur",n:"Natur",e:"🌲",w:[["Baum", "Blume", "Berg", "Fluss", "See", "Wiese", "Gras", "Sand", "Stein", "Meer", "Blatt", "Ast", "Pilz", "Hügel", "Bach", "Insel", "Feld", "Rose", "Tanne", "Sonnenblume", "Wald", "Wurzel", "Busch", "Erde", "Tulpe", "Strauch", "Gänseblümchen", "Stamm", "Ufer", "Teich"],["Wasserfall", "Vulkan", "Gletscher", "Höhle", "Klippe", "Düne", "Sumpf", "Moor", "Tal", "Quelle", "Lagune", "Eiche", "Birke", "Farn", "Moos", "Löwenzahn", "Tannenzapfen", "Eichel", "Kaktus", "Bambus", "Gipfel", "Weide", "Buche", "Ahorn", "Linde", "Efeu", "Brennnessel", "Klee", "Distel", "Wüste"],["Geysir", "Fjord", "Savanne", "Tundra", "Korallenriff", "Delta", "Schlucht", "Plateau", "Mangrove", "Regenwald", "Steppe", "Heide", "Atoll", "Findling", "Stalaktit", "Kiefer", "Lavendel", "Orchidee", "Mammutbaum", "Bernstein", "Stalagmit", "Moräne", "Archipel", "Kratersee", "Felsspalte", "Sanddorn", "Wacholder", "Edelweiß", "Enzian", "Trauerweide"]]},
{id:"fahrzeuge",n:"Fahrzeuge",e:"🚗",w:[["Auto", "Fahrrad", "Bus", "Zug", "Flugzeug", "Schiff", "Motorrad", "Traktor", "Roller", "Boot", "Lastwagen", "Hubschrauber", "Straßenbahn", "Taxi", "U-Bahn", "Krankenwagen", "Feuerwehrauto", "Bagger", "Kinderwagen", "Rakete", "Polizeiauto", "Dreirad", "Laufrad", "Rennrad", "Mofa", "Rollstuhl", "Kleinbus", "Flieger", "Dampfer", "Lkw"],["Segelboot", "Wohnmobil", "Fähre", "Wohnwagen", "Gabelstapler", "Kran", "Quad", "Tretroller", "Müllwagen", "Kutsche", "Schlitten", "Panzer", "Heißluftballon", "Zeppelin", "Rennwagen", "Jetski", "Cabrio", "Dampflok", "Pickup", "Lieferwagen", "Motorboot", "Ruderboot", "Hausboot", "Schneemobil", "Geländewagen", "Limousine", "Kleinwagen", "Reisebus", "Güterzug", "Doppeldecker"],["Segway", "Rikscha", "Gondel", "Draisine", "Seilbahn", "Mähdrescher", "Schneepflug", "Planierraupe", "Tankwagen", "Schubkarre", "Katamaran", "Tretboot", "Hängegleiter", "Bergbahn", "Oldtimer", "Hochrad", "Lastenrad", "Rettungsboot", "Sattelschlepper", "Kehrmaschine", "Raddampfer", "Frachter", "Tragflügelboot", "Luftkissenboot", "Rettungshubschrauber", "Betonmischer", "Dumper", "Straßenwalze", "Schienenbus", "Pferdewagen"]]},
{id:"kleidung",n:"Kleidung",e:"👕",w:[["Hose", "Jacke", "Pullover", "Schuhe", "Socken", "Mütze", "Schal", "Handschuhe", "Kleid", "Rock", "Hemd", "T-Shirt", "Gürtel", "Stiefel", "Unterhose", "Mantel", "Jeans", "Pyjama", "Hut", "Brille", "Sweatshirt", "Kappe", "Gummistiefel", "Nachthemd", "Jogginghose", "Lätzchen", "Halskette", "Armband", "Ring", "Tuch"],["Krawatte", "Weste", "Bluse", "Anzug", "Badehose", "Bikini", "Regenmantel", "Sandalen", "Turnschuhe", "Leggings", "Strumpfhose", "Kapuzenpullover", "Latzhose", "Trenchcoat", "Shorts", "Poncho", "Fliege", "Sakko", "Trikot", "Hausschuhe", "Daunenjacke", "Lederjacke", "Wollmütze", "Winterstiefel", "Pumps", "Ballerinas", "Mokassins", "Cardigan", "Polohemd", "Minirock"],["Smoking", "Cape", "Kummerbund", "Rollkragenpullover", "Pumphose", "Korsett", "Kimono", "Dirndl", "Lederhose", "Unterhemd", "Cordhose", "Gamaschen", "Schlaghose", "Zylinder", "Baskenmütze", "Strohhut", "Ohrenschützer", "Overall", "Morgenmantel", "Halstuch", "Abendkleid", "Frack", "Stola", "Bolero", "Pelerine", "Kittel", "Schürze", "Hosenträger", "Krinoline", "Kniestrümpfe"]]},
{id:"musik",n:"Musik & Instrumente",e:"🎸",w:[["Gitarre", "Klavier", "Geige", "Flöte", "Trommel", "Trompete", "Saxofon", "Mikrofon", "Lied", "Orchester", "Chor", "Konzert", "Radio", "Noten", "Band", "Bass", "Harfe", "Keyboard", "Tamburin", "Xylofon", "Musik", "Melodie", "Rhythmus", "Gesang", "Schlagzeuger", "Musikbox", "Kassette", "Playlist", "Ton", "Takt"],["Cello", "Klarinette", "Posaune", "Akkordeon", "Mundharmonika", "Dudelsack", "Blockflöte", "Schlagzeug", "Triangel", "Ukulele", "Banjo", "Taktstock", "Notenschlüssel", "Metronom", "Rassel", "Tuba", "Oboe", "Konzertflügel", "Plattenspieler", "Verstärker", "Bratsche", "Violine", "Piano", "Synthesizer", "E-Gitarre", "Notenständer", "Gitarrensaite", "Plektrum", "Schallplatte", "Jukebox"],["Fagott", "Zither", "Hackbrett", "Glockenspiel", "Kontrabass", "Piccolo", "Bongo", "Didgeridoo", "Maracas", "Panflöte", "Sitar", "Harmonium", "Cembalo", "Orgel", "Kastagnetten", "Querflöte", "Waldhorn", "Spieluhr", "Stimmgabel", "Kazoo", "Englischhorn", "Bassklarinette", "Fanfare", "Flügelhorn", "Euphonium", "Gong", "Cajón", "Mandoline", "Lyra", "Okarina"]]},
{id:"koerper",n:"Körper",e:"🦶",w:[["Kopf", "Nase", "Mund", "Auge", "Ohr", "Hand", "Fuß", "Bein", "Arm", "Finger", "Haare", "Zahn", "Bauch", "Rücken", "Herz", "Knie", "Zunge", "Hals", "Daumen", "Zeh", "Po", "Haut", "Knochen", "Blut", "Muskel", "Bart", "Wade", "Oberschenkel", "Fingerspitze", "Augenlid"],["Ellenbogen", "Schulter", "Lippe", "Wimper", "Augenbraue", "Kinn", "Stirn", "Wange", "Handgelenk", "Knöchel", "Ferse", "Nagel", "Hüfte", "Nacken", "Gaumen", "Lunge", "Magen", "Rippe", "Brust", "Gesicht", "Schläfe", "Nasenflügel", "Ohrläppchen", "Zahnfleisch", "Unterarm", "Oberarm", "Kniekehle", "Bauchnabel", "Achsel", "Zehennagel"],["Zwerchfell", "Schlüsselbein", "Wirbelsäule", "Achillessehne", "Leber", "Niere", "Milz", "Bandscheibe", "Kniescheibe", "Gehirn", "Netzhaut", "Trommelfell", "Speiseröhre", "Darm", "Daumenballen", "Fußsohle", "Handfläche", "Kehlkopf", "Mandeln", "Schienbein", "Bauchspeicheldrüse", "Gallenblase", "Schilddrüse", "Steißbein", "Oberschenkelknochen", "Speiche", "Elle", "Regenbogenhaut", "Luftröhre", "Aorta"]]},
{id:"schule",n:"Schule & Büro",e:"📚",w:[["Stift", "Heft", "Buch", "Tafel", "Lineal", "Radiergummi", "Schere", "Kleber", "Rucksack", "Mäppchen", "Klassenzimmer", "Pause", "Zeugnis", "Hausaufgabe", "Schreibtisch", "Papier", "Bleistift", "Buntstift", "Taschenrechner", "Stundenplan", "Note", "Klasse", "Unterricht", "Prüfung", "Schulbus", "Klingel", "Schultasche", "Mitschüler", "Pult", "Kugelschreiber"],["Locher", "Tacker", "Büroklammer", "Ordner", "Aktenkoffer", "Kopierer", "Whiteboard", "Textmarker", "Spitzer", "Füller", "Zirkel", "Geodreieck", "Schulranzen", "Klassenarbeit", "Schulhof", "Aula", "Pausenbrot", "Notizblock", "Haftnotiz", "Umschlag", "Schulheft", "Schulbuch", "Lehrerzimmer", "Mensa", "Vokabeln", "Klassenbuch", "Kalender", "Ablage", "Büroschrank", "Computerraum"],["Laminiergerät", "Reißzwecke", "Aktenvernichter", "Overheadprojektor", "Tintenkiller", "Klebeband", "Sekretariat", "Stempelkissen", "Aktenschrank", "Besprechungsraum", "Abitur", "Diplom", "Referat", "Protokoll", "Schnellhefter", "Hängeregister", "Lesezeichen", "Wörterbuch", "Zettelkasten", "Kreide", "Klausur", "Semester", "Hörsaal", "Rechenschieber", "Dissertation", "Thesenpapier", "Schulleiter", "Tonpapier", "Bürostuhl", "Faltblatt"]]},
{id:"feste",n:"Feste & Feiertage",e:"🎉",w:[["Weihnachten", "Ostern", "Geburtstag", "Silvester", "Hochzeit", "Karneval", "Nikolaus", "Geschenk", "Weihnachtsbaum", "Osterhase", "Feuerwerk", "Luftballon", "Party", "Taufe", "Halloween", "Ostereier", "Adventskranz", "Konfetti", "Einladung", "Lebkuchen", "Torte", "Kürbis", "Geburtstagskuchen", "Glückwunsch", "Gäste", "Tanzfläche", "Wunderkerze", "Weihnachtslied", "Schleife", "Plätzchen"],["Pfingsten", "Fasching", "Erntedank", "Muttertag", "Vatertag", "Valentinstag", "Neujahr", "Allerheiligen", "Oktoberfest", "Schützenfest", "Laternenumzug", "Himmelfahrt", "Silberhochzeit", "Jubiläum", "Richtfest", "Abschlussfeier", "Einschulung", "Kommunion", "Konfirmation", "Weihnachtsmarkt", "Stollen", "Glühwein", "Weihnachtsmann", "Christbaumkugel", "Lichterkette", "Osterfeuer", "Sommerfest", "Straßenfest", "Dorffest", "Gartenparty"],["Walpurgisnacht", "Fronleichnam", "Aschermittwoch", "Rosenmontag", "Maibaum", "Dreikönigstag", "Polterabend", "Junggesellenabschied", "Diwali", "Chanukka", "Ramadan", "Zuckerfest", "Thanksgiving", "Nationalfeiertag", "Sonnenwende", "Lichterfest", "Ostermontag", "Karfreitag", "Heiligabend", "Pessach", "Reformationstag", "Volkstrauertag", "Totensonntag", "Palmsonntag", "Gründonnerstag", "Epiphanias", "Tag der Arbeit", "Holi", "Nikolausstiefel", "Hochzeitstanz"]]},
{id:"urlaub",n:"Urlaub & Reisen",e:"🧳",w:[["Strand", "Koffer", "Hotel", "Sonnenbrille", "Sonnencreme", "Zelt", "Reisepass", "Landkarte", "Badeanzug", "Ferienhaus", "Sonnenschirm", "Liegestuhl", "Postkarte", "Souvenir", "Ticket", "Kreuzfahrt", "Ferien", "Reiseführer", "Schnorchel", "Luftmatratze", "Badetuch", "Reisetasche", "Urlaub", "Wasserrutsche", "Sandburg", "Muschel", "Fotoapparat", "Reiseziel", "Bergtour", "Zeltplatz"],["Jugendherberge", "Pauschalreise", "Rundreise", "Stadtführung", "Visum", "Zollkontrolle", "Gepäckband", "Handgepäck", "Reiseapotheke", "Flugticket", "Wüstentour", "Safari", "Kofferwaage", "Hängematte", "Strandkorb", "Buchungsbestätigung", "Reisebüro", "Rucksacktour", "Mietwagen", "Ferienwohnung", "Pension", "Appartement", "Reisegruppe", "Skiurlaub", "Städtetrip", "Badeurlaub", "Wanderurlaub", "Passkontrolle", "Sonnenbrand", "Bahnreise"],["Zwischenlandung", "Zeitverschiebung", "Reisewarnung", "Reiseversicherung", "Schlafwagen", "Gepäckträger", "Nachtzug", "Trampen", "Fernweh", "Reiseleiter", "Bordkarte", "Einchecken", "Hostel", "Sehenswürdigkeit", "Wanderkarte", "Reiseproviant", "Strandliege", "Vollpension", "Mitfahrgelegenheit", "Kurtaxe", "Halbpension", "Reisepreis", "Umsteigen", "Verspätung", "Gepäckverlust", "Reiseroute", "Bordverpflegung", "Gästebuch", "Reisetagebuch", "Transitvisum"]]},
{id:"technik",n:"Technik & Elektronik",e:"💻",w:[["Handy", "Computer", "Fernseher", "Kamera", "Kopfhörer", "Tastatur", "Computermaus", "Drucker", "Lautsprecher", "Akku", "Batterie", "Steckdose", "Kabel", "Ladegerät", "Fernbedienung", "Tablet", "Laptop", "Bildschirm", "Taschenlampe", "Router", "Telefon", "Internet", "Glühbirne", "Stecker", "Smartphone", "App", "Mauspad", "Ladekabel", "Videospiel", "Strom"],["Webcam", "Smartwatch", "Powerbank", "Navigationsgerät", "Spielkonsole", "Joystick", "Beamer", "Scanner", "Speicherkarte", "Festplatte", "Verlängerungskabel", "Mehrfachsteckdose", "Mähroboter", "Rasierer", "Föhn", "Thermostat", "Soundbar", "Drohne", "Videokamera", "Antenne", "USB-Stick", "E-Book-Reader", "Radiowecker", "Bluetooth", "WLAN", "Monitor", "Funkgerät", "Fitnessarmband", "Navi", "Ladestation"],["Oszilloskop", "Kondensator", "Transistor", "Platine", "Mikrochip", "Prozessor", "Grafikkarte", "Arbeitsspeicher", "Netzteil", "Sicherung", "Schalter", "Dimmer", "Bewegungsmelder", "Rauchmelder", "Satellitenschüssel", "Glasfaser", "Modem", "Server", "Barcodescanner", "Thermometer", "Multimeter", "Widerstand", "Spule", "Lötstation", "Halbleiter", "Mikrocontroller", "Netzwerkkabel", "Patchkabel", "Relais", "Steckplatine"]]},
{id:"maerchen",n:"Märchen & Fantasie",e:"🐉",w:[["Drache", "Hexe", "Zauberer", "Prinzessin", "Prinz", "König", "Königin", "Schloss", "Zauberstab", "Fee", "Riese", "Zwerg", "Einhorn", "Geist", "Vampir", "Kristallkugel", "Krone", "Zaubertrank", "Schatzkarte", "Piratenschiff", "Pirat", "Ritter", "Monster", "Gespenst", "Märchen", "Wunsch", "Schatz", "Zauberei", "Zauberhut", "Märchenbuch"],["Werwolf", "Zombie", "Meerjungfrau", "Kobold", "Elfe", "Troll", "Rotkäppchen", "Aschenputtel", "Dornröschen", "Schneewittchen", "Rumpelstilzchen", "Froschkönig", "Knusperhäuschen", "Zauberspiegel", "Flaschengeist", "Zauberteppich", "Phönix", "Pegasus", "Rattenfänger", "Wichtel", "Hänsel", "Gretel", "Däumling", "Rapunzel", "Sterntaler", "Goldesel", "Zauberflöte", "Gestiefelter Kater", "Hexenhaus", "Drachenhöhle"],["Basilisk", "Greif", "Zentaur", "Minotaurus", "Sphinx", "Hydra", "Zyklop", "Golem", "Banshee", "Nixe", "Gnom", "Irrlicht", "Lindwurm", "Walküre", "Zauberlehrling", "Waldgeist", "Hexenbesen", "Zauberwald", "Drachenei", "Feenstaub", "Dämon", "Seeungeheuer", "Elfenkönig", "Waldelfe", "Zauberbann", "Fluch", "Prophezeiung", "Feenring", "Hexenkessel", "Drachenreiter"]]},
{id:"spiele",n:"Spiele & Spielzeug",e:"🧩",w:[["Puzzle", "Teddy", "Ball", "Puppe", "Kartenspiel", "Würfel", "Rutsche", "Memory", "Seifenblasen", "Kreisel", "Springseil", "Murmel", "Sandeimer", "Bauklötze", "Schaukel", "Wippe", "Plüschtier", "Spielzeugauto", "Knete", "Hüpfburg", "Brettspiel", "Verstecken", "Fangen", "Gummiball", "Kuscheltier", "Spielzeug", "Spielkarten", "Sandkasten", "Stoffpuppe", "Holzeisenbahn"],["Domino", "Mikado", "Wackelturm", "Kicker", "Dartscheibe", "Jojo", "Frisbee", "Bumerang", "Gummitwist", "Spielzeugeisenbahn", "Ritterburg", "Murmelbahn", "Wasserpistole", "Zauberwürfel", "Stelzen", "Hampelmann", "Puppenhaus", "Schaukelpferd", "Kaleidoskop", "Schneekugel", "Schnitzeljagd", "Blindekuh", "Mühle", "Mau-Mau", "Schwarzer Peter", "Quartett", "Stein-Schere-Papier", "Tischkicker", "Ringewerfen", "Dosenwerfen"],["Tangram", "Backgammon", "Mahjong", "Halma", "Dame", "Skat", "Rommé", "Doppelkopf", "Poker", "Bingo", "Roulette", "Flipper", "Stehaufmännchen", "Diabolo", "Kasperletheater", "Kaufladen", "Steckenpferd", "Zauberkasten", "Experimentierkasten", "Metallbaukasten", "Canasta", "Bridge", "Schafkopf", "Binokel", "Cribbage", "Kniffel", "Solitär", "Senet", "Bauernschach", "Pachisi"]]},
{id:"werkzeug",n:"Werkzeug & Handwerk",e:"🔨",w:[["Hammer", "Säge", "Zange", "Schraubenzieher", "Schraube", "Bohrer", "Schaufel", "Leiter", "Axt", "Pinsel", "Farbe", "Zollstock", "Feile", "Hobel", "Schleifpapier", "Spaten", "Werkbank", "Wasserwaage", "Gartenschere", "Werkzeugkasten", "Blechschere", "Schraubendreher", "Gartenschlauch", "Gießkanne", "Harke", "Sägeblatt", "Holzleim", "Rasenmäher", "Schleifklotz", "Taschenmesser"],["Akkuschrauber", "Stichsäge", "Bohrmaschine", "Schraubenschlüssel", "Meißel", "Winkelschleifer", "Kreissäge", "Heißklebepistole", "Maßband", "Spachtel", "Farbroller", "Kelle", "Hacke", "Rechen", "Schweißgerät", "Dübel", "Schraubstock", "Nietzange", "Amboss", "Spitzhacke", "Gabelschlüssel", "Ringschlüssel", "Inbusschlüssel", "Seitenschneider", "Kombizange", "Handsäge", "Cuttermesser", "Gummihammer", "Steckschlüssel", "Feinsäge"],["Drechselbank", "Stemmeisen", "Fuchsschwanz", "Gliedermaßstab", "Lötkolben", "Rohrzange", "Gewindeschneider", "Richtscheit", "Senkblei", "Ahle", "Gehrungslade", "Schweißbrenner", "Schmiedehammer", "Töpferscheibe", "Webstuhl", "Nähmaschine", "Bandsäge", "Schlagbohrer", "Oberfräse", "Flachzange", "Fugenkelle", "Glättkelle", "Reibebrett", "Zahnspachtel", "Metallsäge", "Bolzenschneider", "Schraubzwinge", "Handbohrer", "Anreißnadel", "Kantenhobel"]]},
{id:"wetter",n:"Wetter & Jahreszeiten",e:"🌈",w:[["Sonne", "Regen", "Schnee", "Wind", "Wolke", "Gewitter", "Blitz", "Donner", "Nebel", "Hagel", "Regenbogen", "Frühling", "Sommer", "Herbst", "Winter", "Schneemann", "Hitze", "Kälte", "Regenschirm", "Pfütze", "Frost", "Tau", "Schauer", "Schneeball", "Sonnenstrahl", "Wolkenbruch", "Temperatur", "Himmel", "Regentropfen", "Windböe"],["Sturm", "Orkan", "Tornado", "Hurrikan", "Dürre", "Hochwasser", "Überschwemmung", "Lawine", "Glatteis", "Schneeflocke", "Eiszapfen", "Raureif", "Morgentau", "Windstille", "Sonnenschein", "Dämmerung", "Sonnenaufgang", "Sonnenuntergang", "Polarlicht", "Schneesturm", "Monsun", "Taifun", "Blizzard", "Dunst", "Smog", "Schwüle", "Wetterleuchten", "Eisregen", "Windhose", "Schneefall"],["Sonnenfinsternis", "Mondfinsternis", "Tagundnachtgleiche", "Hitzewelle", "Kaltfront", "Hochdruckgebiet", "Tiefdruckgebiet", "Luftfeuchtigkeit", "Taupunkt", "Wetterfahne", "Wetterfrosch", "Barometer", "Windstärke", "Nieselregen", "Platzregen", "Graupel", "Schneeregen", "Altweibersommer", "Eisheilige", "Wetterbericht", "Jetstream", "Passatwind", "Kugelblitz", "Hygrometer", "Niederschlag", "Isobare", "Wetterstation", "Mistral", "Bora", "Wetterkarte"]]}
];
const LV = ['leicht', 'mittel', 'schwer'];
const poolOf = c => CATS.filter(x => c.cats.includes(x.id)).flatMap(x => x.w.flatMap((l, i) => c.lv.includes(LV[i]) ? l : []));
const catOf = w => CATS.find(x => x.w.some(l => l.includes(w)));
const sh = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const maxK = n => Math.max(1, Math.floor((n - 1) / 2));

async function tok(env) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.PASSWORT), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const s = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode('hochstapler-v1'));
  return [...new Uint8Array(s)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: H });
    if (u.pathname === '/') return new Response('Hochstapler läuft, Server-Version ' + WV);
    if (!env.PASSWORT) return J({ e: 'PASSWORT fehlt' }, 500);
    if (u.pathname === '/api/login') {
      const b = await req.json().catch(() => ({}));
      if (b.pw !== env.PASSWORT) { await new Promise(r => setTimeout(r, 800)); return J({ e: 'falsch' }, 401); }
      return J({ token: await tok(env) });
    }
    if (u.pathname === '/api/check') return u.searchParams.get('token') === await tok(env) ? J({ ok: 1 }) : J({ e: 'x' }, 401);
    if (u.pathname === '/api/create') {
      const b = await req.json().catch(() => ({}));
      if (b.token !== await tok(env)) return J({ e: 'login' }, 401);
      for (let i = 0; i < 8; i++) {
        const code = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.random() * 24 | 0]).join('');
        const r = await env.ROOMS.get(env.ROOMS.idFromName(code)).fetch('https://do/init?code=' + code, { method: 'POST' });
        if (r.ok) return J({ code });
      }
      return J({ e: 'voll' }, 500);
    }
    if (u.pathname === '/ws') {
      if (req.headers.get('Upgrade') !== 'websocket') return new Response('WebSocket nötig', { status: 400 });
      const code = (u.searchParams.get('raum') || '').toUpperCase().replace(/[^A-Z]/g, '');
      return env.ROOMS.get(env.ROOMS.idFromName(code)).fetch(req);
    }
    return new Response('?', { status: 404 });
  }
};

export class Room {
  constructor(st, env) { this.st = st; this.env = env; this.S = null; this.ws = new Map(); this.q = Promise.resolve(); }
  async load() { if (!this.S) { this.S = (await this.st.storage.get('S')) || null; if (this.S) { const c = this.S.cfg; if (!c.cats) c.cats = CATS.map(x => x.id); if (!Array.isArray(c.lv)) c.lv = LV.includes(c.lv) ? [c.lv] : [...LV]; if (!c.hint) c.hint = 'cat'; } } }
  async save() { await this.st.storage.put('S', this.S); }

  async fetch(req) {
    const u = new URL(req.url);
    if (u.pathname === '/draw') {
      const b = await req.json();
      let U = (await this.st.storage.get('U')) || [];
      let p = b.pool.filter(w => !U.includes(w));
      if (!p.length) { U = U.filter(w => !b.pool.includes(w)); p = b.pool; }
      const w = p[Math.random() * p.length | 0];
      U.push(w);
      await this.st.storage.put('U', U);
      return J({ w });
    }
    if (u.pathname === '/reset') { await this.st.storage.put('U', []); return J({ ok: 1 }); }
    await this.load();
    if (u.pathname === '/init') {
      if (this.S) return new Response('x', { status: 409 });
      this.S = { code: u.searchParams.get('code'), players: [], host: null, ph: 'lobby', cfg: { type: 'blitz', rounds: 5, mode: 'bekannt', k: 1, max: 2, timer: 0, cats: CATS.map(x => x.id), lv: [...LV], hint: 'cat' }, round: 0, G: null };
      await this.save();
      return new Response('ok');
    }
    if (!this.S) return new Response('Raum nicht gefunden', { status: 404 });
    const [c, s] = Object.values(new WebSocketPair());
    s.accept();
    let pid = null;
    const err = e => s.send(JSON.stringify({ t: 'err', e }));
    const onMsg = async data => {
      let m; try { m = JSON.parse(data); } catch { return; }
      await this.load();
      const S = this.S;
      if (m.t === 'join') {
        let p = m.pid && S.players.find(x => x.id === m.pid);
        if (!p) {
          const name = String(m.name || '').trim().slice(0, 14);
          if (S.ph !== 'lobby') return err('Das Spiel läuft schon.');
          if (!name || S.players.some(x => x.name === name)) return err('Dieser Name ist ungültig oder schon vergeben.');
          if (S.players.length >= 20) return err('Der Raum ist voll.');
          p = { id: crypto.randomUUID().slice(0, 8), name, sc: 0 };
          S.players.push(p);
          if (!S.host) S.host = p.id;
          this.clamp();
        }
        pid = p.id;
        this.ws.set(pid, s);
        s.send(JSON.stringify({ t: 'me', pid }));
      } else if (pid) await this.act(pid, m);
      await this.save();
      this.push();
    };
    s.addEventListener('message', ev => { this.q = this.q.then(() => onMsg(ev.data)).catch(() => {}); });
    s.addEventListener('close', () => { if (pid && this.ws.get(pid) === s) this.ws.delete(pid); this.push(); });
    return new Response(null, { status: 101, webSocket: c });
  }

  clamp() {
    const c = this.S.cfg, n = this.S.players.length, l = maxK(n);
    c.k = Math.min(Math.max(c.k, 1), l);
    if (!c.maxSet) c.max = Math.max(2, Math.floor(n / 3));
    c.max = Math.min(Math.max(c.max, 2), Math.max(2, l));
    c.rounds = Math.min(20, Math.max(1, c.rounds));
  }

  async newRound() {
    const S = this.S, c = S.cfg, P = S.players.map(p => p.id);
    const k = c.mode === 'geheim' ? 1 + (Math.random() * c.max | 0) : c.k;
    const r = await this.env.ROOMS.get(this.env.ROOMS.idFromName('WORDS')).fetch('https://do/draw', { method: 'POST', body: JSON.stringify({ pool: poolOf(c) }) });
    const word = (await r.json()).w;
    S.round++; S.ph = 'role';
    S.G = { k, imp: sh(P).slice(0, k), word, cat: catOf(word).id, votes: {}, guess: {}, seen: [], start: P[Math.random() * P.length | 0], gi: 0 };
  }

  reveal() {
    const S = this.S, G = S.G, I = G.imp, V = S.players.map(p => p.id).filter(x => !I.includes(x));
    G.th = Math.ceil(V.length / 2);
    G.cnt = {}; S.players.forEach(p => G.cnt[p.id] = V.filter(v => G.votes[v].includes(p.id)).length);
    G.ent = {}; I.forEach(h => G.ent[h] = G.cnt[h] >= G.th);
    S.ph = 'reveal';
  }

  finish() {
    const S = this.S, G = S.G, I = G.imp, c = S.cfg, geh = c.mode === 'geheim';
    const ids = S.players.map(p => p.id), V = ids.filter(x => !I.includes(x)), won = {}, d = {};
    I.forEach(h => won[h] = !G.ent[h] || G.guess[h]);
    G.allLost = I.every(h => !won[h]);
    G.W = G.allLost ? V : I.filter(h => won[h]);
    ids.forEach(x => d[x] = 0);
    I.forEach(h => d[h] = (G.ent[h] ? 0 : 2) + (G.guess[h] ? 2 : 0));
    V.forEach(v => {
      const t = G.votes[v]; let s = G.allLost ? 1 : 0;
      if (geh) {
        if (t.length > G.k) s -= t.length - G.k;
        else { const h = t.filter(x => I.includes(x)).length; s += h; if (G.k > 1 && h === G.k) s++; }
      } else { const h = t.filter(x => G.ent[x]).length; s += h; if (G.k > 1 && h === G.k) s++; }
      d[v] = s;
    });
    G.d = d;
    if (c.type === 'turnier') S.players.forEach(p => p.sc += d[p.id]);
    S.ph = 'result';
  }

  judge() {
    const S = this.S, g = S.G.imp[S.G.gi];
    return g !== S.host ? S.host : S.players.find(p => p.id !== g).id;
  }

  async act(pid, m) {
    const S = this.S, G = S.G, H0 = pid === S.host, c = S.cfg, ph = S.ph;
    if (ph === 'lobby') {
      if (!H0) return;
      if (m.t === 'cfg') {
        if (m.k === 'type' || m.k === 'mode') { if (['blitz', 'turnier', 'bekannt', 'geheim'].includes(m.v)) c[m.k] = m.v; }
        else if (['k', 'max', 'rounds'].includes(m.k)) { c[m.k] += m.d > 0 ? 1 : -1; if (m.k === 'max') c.maxSet = true; }
        else if (m.k === 'lv') { if (LV.includes(m.v)) { const i = c.lv.indexOf(m.v); if (i >= 0) { if (c.lv.length > 1) c.lv.splice(i, 1); } else c.lv = LV.filter(x => x === m.v || c.lv.includes(x)); } }
        else if (m.k === 'hint') { if (['cat', 'none'].includes(m.v)) c.hint = m.v; }
        else if (m.k === 'cat') { const i = c.cats.indexOf(m.v); if (i >= 0) c.cats.splice(i, 1); else if (CATS.some(x => x.id === m.v)) c.cats.push(m.v); }
        else if (m.k === 'catall') c.cats = m.v ? CATS.map(x => x.id) : [];
        else if (m.k === 'timer') { const t = Number(m.v); if ([0, 1, 2, 3, 5].includes(t)) c.timer = t; }
        this.clamp();
      }
      if (m.t === 'resetwords') {
        await this.env.ROOMS.get(this.env.ROOMS.idFromName('WORDS')).fetch('https://do/reset', { method: 'POST' });
        const sk = this.ws.get(pid); if (sk) { try { sk.send(JSON.stringify({ t: 'note', e: 'Das Wortgedächtnis wurde zurückgesetzt.' })); } catch (e) {} }
      }
      if (m.t === 'kick') {
        const t = S.players.find(p => p.id === m.id);
        if (t && t.id !== S.host) {
          S.players = S.players.filter(p => p !== t);
          const sk = this.ws.get(t.id); this.ws.delete(t.id);
          if (sk) { try { sk.send(JSON.stringify({ t: 'err', e: 'Du wurdest aus dem Raum entfernt.' })); sk.close(); } catch (e) {} }
          this.clamp();
        }
      }
      if (m.t === 'start' && c.cats.length && S.players.length >= (c.mode === 'geheim' ? 5 : 4)) { S.players.forEach(p => p.sc = 0); S.round = 0; await this.newRound(); }
      return;
    }
    if (m.t === 'end' && H0) { S.ph = 'lobby'; S.G = null; return; }
    if (m.t === 'restart' && H0 && ph !== 'result') {
      const keep = S.players.filter(p => p.id === S.host || this.ws.has(p.id));
      if (keep.length < (c.mode === 'geheim' ? 5 : 4) || keep.length === S.players.length) return;
      S.players = keep; this.clamp(); S.round--; await this.newRound(); return;
    }
    if (m.t === 'seen' && ph === 'role') {
      if (!G.seen.includes(pid)) G.seen.push(pid);
      if (G.seen.length >= S.players.length) { S.ph = 'talk'; G.t0 = Date.now(); }
    } else if (m.t === 'next' && H0) {
      if (ph === 'talk') S.ph = 'vote';
      else if (ph === 'reveal') { S.ph = 'guess'; G.gi = 0; }
      else if (ph === 'result') { if (c.type === 'turnier' && S.round >= c.rounds) { S.ph = 'lobby'; S.G = null; } else await this.newRound(); }
    } else if (m.t === 'vote' && ph === 'vote' && !G.votes[pid]) {
      const ids = [...new Set(m.ids || [])].filter(x => x !== pid && S.players.some(p => p.id === x));
      if (c.mode === 'geheim' ? ids.length >= 1 : ids.length === G.k) {
        G.votes[pid] = ids;
        if (Object.keys(G.votes).length >= S.players.length) this.reveal();
      }
    } else if (m.t === 'ans' && ph === 'guess' && pid === this.judge()) {
      G.guess[G.imp[G.gi]] = !!m.v; G.gi++;
      if (G.gi >= G.imp.length) this.finish();
    }
  }

  view(me) {
    const S = this.S, G = S.G;
    const v = { t: 's', wv: WV, now: Date.now(), me, code: S.code, host: S.host, ph: S.ph, cfg: S.cfg, round: S.round, players: S.players.map(p => ({ id: p.id, name: p.name, sc: p.sc, on: this.ws.has(p.id) })) };
    if (!G) return v;
    const late = ['reveal', 'guess', 'result'].includes(S.ph);
    v.k = (S.cfg.mode === 'bekannt' || late) ? G.k : null;
    if (S.ph === 'role') v.role = { imp: G.imp.includes(me), word: G.imp.includes(me) ? null : G.word, cat: (G.imp.includes(me) && S.cfg.hint !== 'cat') ? null : G.cat, seen: G.seen.includes(me), n: G.seen.length };
    if (S.ph === 'talk' && S.cfg.timer) v.tend = G.t0 + S.cfg.timer * 60000;
    if (S.ph === 'talk') { const L = S.players, s = L.findIndex(p => p.id === G.start); v.order = L.map((_, j) => L[(s + j) % L.length].id); }
    if (S.ph === 'vote') { v.voted = Object.keys(G.votes).length; v.my = G.votes[me] || null; }
    if (late) v.rev = { cnt: G.cnt, imp: G.imp, ent: G.ent, th: G.th, nv: S.players.length - G.imp.length, votes: G.votes };
    if (S.ph === 'guess') { v.guesser = G.imp[G.gi]; v.judge = this.judge(); }
    if (S.ph === 'result') v.res = { word: G.word, cat: G.cat, W: G.W, allLost: G.allLost, d: G.d, last: S.cfg.type === 'turnier' && S.round >= S.cfg.rounds };
    return v;
  }

  push() {
    for (const [pid, sock] of this.ws) { try { sock.send(JSON.stringify(this.view(pid))); } catch (e) {} }
  }
}
