'use client';

import { useState } from 'react';
import { characters, CharacterConfig } from '@/config/characters';
import QRModal from '@/components/QRModal';
import styles from './page.module.css';

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterConfig | null>(null);

  const handleSelectCharacter = (character: CharacterConfig) => {
    setSelectedCharacter(character);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>QR Character Generator</h1>
        <p className={styles.subtitle}>Chọn nhân vật yêu thích và tạo QR code độc đáo</p>
      </header>

      <div className={styles.charactersGrid}>
        {characters.map((character) => (
          <div
            key={character.id}
            className={`${styles.characterCard} ${selectedCharacter?.id === character.id ? styles.selected : ''}`}
            onClick={() => handleSelectCharacter(character)}
          >
            <img
              src={character.image}
              alt={character.name}
              className={styles.characterImage}
            />
            <p className={styles.characterName}>{character.name}</p>
          </div>
        ))}
      </div>

      <div className={styles.uploadSection}>
        <QRModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      </div>
    </div>
  );
}

