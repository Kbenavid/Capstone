"use client";
import React from "react";
import Link from "next/link";
import styles from "./NavBar.module.css";
import LogoutButton from "./LogoutButton"; // ✅ add this

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarInner}>
        <div className={styles.brand}>PipeTrack</div>

        <div className={styles.navLinks}>
          <Link href="/" className={styles.navBtn}>Home</Link>
          <Link href="/inventory" className={styles.navBtn}>Inventory</Link>
          <Link href="/jobs" className={styles.navBtn}>Jobs</Link>
        </div>

        <div className={styles.navActions}>
          <LogoutButton /> {/* ✅ Use the real component */}
        </div>
      </div>
    </nav>
  );
}