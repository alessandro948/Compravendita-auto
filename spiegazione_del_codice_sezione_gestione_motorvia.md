# Motorvia: Come funziona la sezione "Gestione"

La sezione **Gestione** è il pannello di controllo (back-office) dell'applicazione. Permette di controllare gli annunci inseriti dagli utenti, leggere le richieste dei clienti interessati e monitorare le vendite concluse.

Tutto funziona direttamente nel browser utilizzando JavaScript e il `localStorage` (la memoria interna del browser) per salvare e aggiornare i dati senza bisogno di un server esterno.

---

## 1. Come è organizzata la pagina (HTML)

La struttura visiva della sezione (`<main id="p-gestione">`) è divisa in quattro aree principali:

1. **Riquadri di riepilogo (`#summary`):** Quattro schede in alto che mostrano a colpo d'occhio i numeri principali (auto in vendita, annunci da approvare, richieste nuove e incassi degli ultimi 30 giorni).
2. **Barra delle schede (`.tabs`):** Tre pulsanti (*Annunci*, *Richieste*, *Vendite*) che permettono di cambiare schermata nascondendo le altre tramite l'attributo HTML `hidden`.
3. **Contenuto delle schede:**
   * **Annunci (`#g-annunci`):** Contiene i filtri per stato e ricerca testuale, più la tabella principale delle auto.
   * **Richieste (`#g-richieste`):** Contiene il filtro per stato e l'elenco dei messaggi inviati dagli acquirenti.
   * **Vendite (`#g-vendite`):** Contiene le statistiche totali, il grafico a barre degli incassi e lo storico delle auto vendute.
4. **Pulsante di ripristino (`#g-reset`):** In fondo alla pagina, serve per cancellare le modifiche fatte nel browser e tornare ai dati iniziali di esempio.

---

## 2. Come funziona il codice (JavaScript)

### Il "regista": la funzione `gestione()`
Il cuore della sezione è la funzione `gestione()`. Ogni volta che l'utente apre la pagina o compie un'azione (ad esempio approva un'auto), questa funzione aggiorna l'intera interfaccia chiamando in sequenza quattro funzioni specifiche:

* **`summary()` (I contatori in alto):** Legge tutti gli annunci e le richieste salvate, conta quanti sono in vendita, quanti in revisione e quante richieste sono ancora da leggere. Inoltre, somma i prezzi di vendita delle auto vendute negli ultimi 30 giorni.
* **`annunci()` (La tabella delle auto):** Filtra le auto in base a ciò che l'utente ha scelto nei filtri, le ordina mettendo in cima quelle *In revisione* e costruisce le righe della tabella. Per ogni auto, la funzione `azioni()` decide quali pulsanti mostrare in base allo stato attuale (es. *Approva/Rifiuta* se è in revisione, *Segna venduta/Ritira* se è già pubblicata).
* **`richieste()` (I messaggi dei clienti):** Associa ogni messaggio all'auto corrispondente tramite il suo ID e crea un riquadro con i recapiti del cliente e il pulsante per segnare la richiesta come *"Gestita"* o riaprirla.
* **`vendite()` (Statistiche e grafico):** Prende solo le auto con stato `"venduto"`, calcola l'incasso totale e la percentuale media di sconto rispetto al prezzo iniziale. Costruisce poi un **grafico a barre** degli ultimi 6 mesi, calcolando l'altezza in pixel di ogni barra in proporzione all'incasso mensile.

---

## 3. Reazione ai clic e conferme di sicurezza

### Un solo "ascoltatore" per tutta la tabella
Invece di collegare un comando a ogni singolo pulsante creato dinamicamente, il codice usa la **delegazione degli eventi** (`addEventListener("click", ...)` sul contenitore padre, come `#a-body` o `#r-list`).
Quando l'utente clicca un pulsante:
1. Il codice legge l'azione scritta nell'attributo `data-act` (es. `"approve"`, `"reject"`, `"del"`) e l'identificativo dell'auto (`data-id`).
2. Aggiorna il dato nella memoria del browser (`updAnnuncio` o `delAnnuncio`).
3. Richiama `gestione()` per ridisegnare subito la schermata con i dati aggiornati.

### Le protezioni contro gli errori (`gs`)
Per evitare operazioni accidentali, il codice utilizza un piccolo oggetto di memoria temporanea chiamato `gs`:
* **Doppia conferma per eliminare:** Cliccando *Elimina*, il pulsante cambia prima scritta in *"Conferma elimina"*; solo al secondo clic l'auto viene rimossa davvero. Lo stesso meccanismo protegge il pulsante *Ripristina i dati di esempio*.
* **Modulo di chiusura vendita:** Cliccando *Segna venduta*, non chiude subito la pratica ma apre una riga extra sotto l'auto in cui è obbligatorio inserire il prezzo finale concordato e il nome dell'acquirente prima di confermare.

---

## 4. Schema riassuntivo per l'esposizione

> *"La sezione Gestione funziona come una dashboard collegata alla memoria del browser (`localStorage`). Una funzione principale chiamata `gestione()` coordina quattro blocchi: aggiorna i contatori in alto, genera la tabella degli annunci con i relativi pulsanti di moderazione, mostra i messaggi dei clienti e calcola le statistiche delle vendite disegnando un grafico a barre degli ultimi 6 mesi. Ogni volta che clicchiamo su un'azione, il codice aggiorna i dati salvati e ridisegna automaticamente tutta la pagina, includendo doppie conferme per evitare eliminazioni per errore."*