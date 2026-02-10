import { useEffect, useState, React } from 'react';
import styled from 'styled-components';

import { fetchConfig } from '../api/config.api.js';
import { fetchGuildChannels, fetchGuildRoles } from '../api/guilds.api.js';
import { createRules } from '../api/rules.api.js';


export default function RulesForm() {

  const [guildId, setGuildId] = useState('');
  const [channelId, setChannelId] = useState('');
  const [message, setMessage] = useState('');
  const [roles, setRoles] = useState([]);
  const [channels, setChannels] = useState([]);

  const [button, setButton] = useState({ roleId: ''});

  const [isChecked, setIsChecked] = useState(false);

  const getMessageChunkCount = (text) => {
    if (!text) return 0;
    return Math.ceil(text.length / 2000);
  };

  const MAX_MESSAGE_LENGTH = 2000 * 10; // Limit dla 10 wiadomości

  useEffect(() => {
    fetchConfig().then((config) => {
      setGuildId(config.guildId);
    });
  } , []);

  useEffect(() => {
    if (!guildId) return;

    fetchGuildChannels(guildId).then(setChannels);

    fetchGuildRoles(guildId).then(setRoles);
  }, [guildId]);


  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      guildId,
      channelId,
      message: {
        content: message,
      },
      buttonChecked: isChecked,
      button: {
        roleId: button.roleId,
      },
    };

    try {
      const result = await createRules(payload);

      alert('Stworzono wiadomość z regulaminem! ID wiadomości: ' + result.messageId);

    } catch (error) {
      console.error(error);
      alert('Błąd walidacji' + (error.response?.data?.message ? ': ' + error.response.data.message : '') + ' - Sprawdź konsolę');
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      <div className="glass-container">
        <h2>Wybierz kanał</h2>
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
        <div className={`rules-container ${channelId ? 'visible' : 'hidden'}`}>
          <h2>Wpisz treść regulaminu</h2>
          <textarea
            placeholder="Treść regulaminu"
            value={message}
            maxLength={MAX_MESSAGE_LENGTH}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div>
            <span>
              Ilość znaków: {message.length} / {MAX_MESSAGE_LENGTH}
            </span>
            {message.length > 2000 && (
              <p>
                Jest więcej niż 2000 znaków. Treść zostanie podzielona na{' '}
                {getMessageChunkCount(message)} wiadomości. Maksymalnie można wysłać{' '}
                {MAX_MESSAGE_LENGTH / 2000} wiadomości.
              </p>
            )}
          </div>
          <div className="checkbox-container">
            <label className="ios-checkbox red">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <div className="checkbox-wrapper">
                <div className="checkbox-bg" />
                <svg className="checkbox-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    className="check-path"
                    d="M4 12L10 18L20 6"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </label>
            <span className="checkbox-text">Dodać przycisk "Akceptuję regulamin"?</span>
          </div>

          {isChecked && (
            <div>
              <h2>Wybierz role akceptacji regulaminu</h2>
              <select
                value={button.roleId}
                onChange={(e) =>
                  setButton({ ...button, roleId: e.target.value })
                }
              >
                <option value="">Wybierz role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        <button type="submit">Zapisz</button>
        </div>
      </div>
    </form>
  );
  }
