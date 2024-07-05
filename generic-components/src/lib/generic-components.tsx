'use client'
import { useEffect, useState } from 'react';
import styles from './generic-components.module.css';
import { UserDocument } from "./models/user"
import { useSession } from 'next-auth/react';

export function GenericComponents() {

  const [ user, setUser ] = useState<UserDocument>()

  const { data: session } = useSession()

  useEffect(() => {
    setUser({
      createdAt: new Date(),
      name: "tutu",
      password: "toto",
      phone: "06",
      email: "tutu@tutu.com",
      image: "",
      updatedAt: new Date()
    })
  }, [])

  useEffect(() => {
    if (user) {
      const d = new Date()
      setInterval(() => setUser({...user, updatedAt: d}), 1000)
    }
  }, [user])

  return (
    <div className={styles['container']}>
      <h1>Welcome to GenericComponents!</h1>
      { session && <div>{JSON.stringify(user)}</div> }
      { !session && <p>public content</p>}
    </div>
  );
}

export default GenericComponents;
