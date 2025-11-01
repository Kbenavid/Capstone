"use client";
import React from "react";
import styles from "./VanCard.module.css";

export default function VanCard({ van }) {
  if (!van) return <p className={styles.empty}>No van data available.</p>;

  return (
    <div className={styles.vanCard}>
      <h3 className={styles.vanTitle}>{van.name || "Unnamed Van"}</h3>

      <div className={styles.vanDetails}>
        <div className={styles.row}>
          <span className={styles.label}>Van ID:</span>
          <span className={styles.value}>{van._id}</span>
        </div>

        {van.licensePlate && (
          <div className={styles.row}>
            <span className={styles.label}>License Plate:</span>
            <span className={styles.value}>{van.licensePlate}</span>
          </div>
        )}

        {van.location && (
          <div className={styles.row}>
            <span className={styles.label}>Location:</span>
            <span className={styles.value}>{van.location}</span>
          </div>
        )}

        {van.capacity && (
          <div className={styles.row}>
            <span className={styles.label}>Capacity:</span>
            <span className={styles.value}>{van.capacity}</span>
          </div>
        )}

        {van.status && (
          <div className={styles.row}>
            <span className={styles.label}>Status:</span>
            <span
              className={`${styles.status} ${
                van.status.toLowerCase() === "active"
                  ? styles.active
                  : styles.inactive
              }`}
            >
              {van.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}