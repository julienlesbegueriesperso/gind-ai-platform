'use client'
import { useEffect, useState } from 'react';
import styles from './generic-components.module.css';
import { UserDocument } from "./models/user"
import { useSession } from 'next-auth/react';

export function GenericComponents() {



  const { data: session } = useSession()


  return (
    <div className={styles['container']}>
      <h1>Welcome to GenericComponents!</h1>
      {/* { session && <div>{JSON.stringify(user)}</div> } */}
      { !session && <p>public content</p>}
    </div>
  );
}

export default GenericComponents;
