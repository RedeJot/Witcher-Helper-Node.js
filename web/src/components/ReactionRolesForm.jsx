// Reactowe hooki do zarządzania stanem i efektami ubocznymi
import { useState, useEffect } from 'react';

// Funkcje API do pobierania danych z backendu
import { fetchGuildChannels } from '../api/guilds.api.js';
import { fetchGuildRoles } from '../api/guilds.api.js';
import { createReactionRoles } from '../api/reactionRoles.api.js';
import { fetchConfig } from '../api/config.api.js';

export default function ReactionRolesForm() {
  // =========================
  // STATE – DANE FORMULARZA
  // =========================

  // ID serwera Discord (pobierane automatycznie z backendu)
  const [guildId, setGuildId] = useState('');

  // Wybrany kanał, do którego bot wyśle wiadomość
  const [channelId, setChannelId] = useState('');

  // Treść wiadomości Discorda
  const [message, setMessage] = useState('');

  // Lista ról dostępnych na serwerze
  const [roles, setRoles] = useState([]);

  // Lista kanałów dostępnych na serwerze
  const [channels, setChannels] = useState([]);

  const BUTTON_STYLES = [
    { label: 'Niebieski', value: 'primary' },
    { label: 'Szary', value: 'secondary' },
    { label: 'Zielony', value: 'success' },
    { label: 'Czerwony', value: 'danger' },
  ];

  // Lista przycisków (reaction roles)
  // Każdy przycisk ma etykietę i przypisaną rolę
  const [buttons, setButtons] = useState([
    { label: '', roleId: '', buttonType: 'secondary' /*, emoji: ''*/ },
  ]);

  // =========================
  // STAŁE – LIMITY DISCORDA
  // =========================

  // Maksymalna długość treści wiadomości Discord
  const MESSAGE_MAX_LENGTH = 2000;

  // Maksymalna długość etykiety przycisku
  const BUTTON_LABEL_MAX_LENGTH = 80;

  // =========================
  // WALIDACJA FORMULARZA
  // =========================

  // Sprawdza, czy formularz jest poprawny
  // Jeśli false – przycisk „Utwórz” jest zablokowany
  const isValid =
    guildId && // musi być guildId
    channelId && // musi być kanał
    message && // musi być treść
    message.length <= MESSAGE_MAX_LENGTH &&
    buttons.every(
      (b) =>
        b.label && // każdy przycisk ma tekst
        b.label.length <= BUTTON_LABEL_MAX_LENGTH &&
        b.roleId, // każdy przycisk ma rolę
    );

  // =========================
  // EFFECT #1 – POBRANIE KONFIGURACJI
  // =========================

  // Ten efekt uruchamia się TYLKO raz (przy starcie komponentu)
  // Pobiera guildId z backendu (np. z .env)
  useEffect(() => {
    fetchConfig().then((config) => {
      setGuildId(config.guildId);
    });
  }, []); // <-- pusta tablica = tylko raz

  // =========================
  // EFFECT #2 – POBRANIE KANAŁÓW I RÓL
  // =========================

  // Ten efekt uruchamia się ZA KAŻDYM RAZEM,
  // gdy zmieni się guildId
  useEffect(() => {
    if (!guildId) return; // zabezpieczenie przed undefined

    // Pobranie kanałów serwera
    fetchGuildChannels(guildId).then(setChannels);

    // Pobranie ról serwera
    fetchGuildRoles(guildId).then(setRoles);
  }, [guildId]);

  // =========================
  // FUNKCJE POMOCNICZE
  // =========================

  // Aktualizuje konkretną właściwość przycisku (label / roleId)
  function updateButton(index, field, value) {
    const copy = [...buttons]; // kopia tablicy
    copy[index][field] = value; // zmiana pola
    setButtons(copy); // zapis do state
  }

  // Dodaje nowy pusty przycisk
  function addButton() {
    setButtons([
      ...buttons,
      { label: '', roleId: '', buttonType: 'secondary' },
    ]);
  }

  // Resetuje formularz po udanym wysłaniu
  function resetForm() {
    setChannelId('');
    setMessage('');
    setButtons([{ label: '', roleId: '', buttonType: 'secondary' }]);
  }

  // =========================
  // OBSŁUGA SUBMITU FORMULARZA
  // =========================

  async function handleSubmit(e) {
    e.preventDefault(); // blokuje reload strony

    // Payload wysyłany do backendu
    const payload = {
      guildId,
      channelId,
      message: {
        content: message,
      },
      buttons: buttons.map((btn) => ({
        label: btn.label,
        roleId: btn.roleId,
        buttonType: btn.buttonType,
      })),
    };

    try {
      // Wywołanie API tworzącego reaction roles
      const result = await createReactionRoles(payload);

      alert('Wysłano wiadomość! ID: ' + result.messageId);

      // Reset formularza po sukcesie
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Błąd walidacji lub API - Sprawdź konsolę');
    }
  }

  // =========================
  // RENDER (JSX)
  // =========================

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reaction Roles</h2>

      {/* SELECT KANAŁU */}
      <select
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
        disabled={!channels.length}
      >
        <option value="">Wybierz kanał</option>
        {channels.map((ch) => (
          <option key={ch.id} value={ch.id}>
            #{ch.name}
          </option>
        ))}
      </select>

      {/* TREŚĆ WIADOMOŚCI */}
      <textarea
        placeholder="Treść wiadomości"
        value={message}
        maxLength={MESSAGE_MAX_LENGTH}
        onChange={(e) => setMessage(e.target.value)}
      />

      <h3>Przyciski</h3>

      {/* LISTA PRZYCISKÓW */}
      {buttons.map((btn, index) => (
        <div key={index} style={{ marginBottom: 12 }}>
          {/* TEKST PRZYCISKU */}
          <input
            placeholder="Tekst Przycisku"
            value={btn.label}
            maxLength={BUTTON_LABEL_MAX_LENGTH}
            onChange={(e) => updateButton(index, 'label', e.target.value)}
          />
          <select
            value={btn.buttonType}
            onChange={(e) => updateButton(index, 'buttonType', e.target.value)}
          >
            {BUTTON_STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* WYBÓR ROLI */}
          <select
            value={btn.roleId}
            onChange={(e) => updateButton(index, 'roleId', e.target.value)}
          >
            <option value="">Wybierz rolę</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                @{role.name}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* DODANIE NOWEGO PRZYCISKU */}
      <button type="button" onClick={addButton}>
        + Dodaj Przycisk
      </button>

      <br />
      <br />

      {/* SUBMIT */}
      <button type="submit" disabled={!isValid}>
        Utwórz
      </button>
    </form>
  );
}
