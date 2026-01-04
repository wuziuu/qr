'use client';

import { useState } from 'react';
import { characters, CharacterConfig } from '@/config/characters';
import QRModal from '@/components/QRModal';
import styles from './page.module.css';

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterConfig | null>(null);

  const handleCreateQR = (character: CharacterConfig) => {
    setSelectedCharacter(character);
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>QR Character Generator</h1>
        <p className={styles.subtitle}>Chọn nhân vật yêu thích và tạo QR code độc đáo</p>
      </header>

      <div className={styles.grid}>
        {characters.map((character) => (
          <div key={character.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <img
                src={character.image}
                alt={character.name}
                className={styles.characterImage}
              />
              <div
                className={styles.colorBar}
                style={{ backgroundColor: character.color.hex }}
              />
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.characterName}>{character.name}</h2>
              <button
                className={styles.createButton}
                onClick={() => handleCreateQR(character)}
                style={{ backgroundColor: character.color.hex }}
              >
                Tạo QR Code
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCharacter && (
        <QRModal
          character={selectedCharacter}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

