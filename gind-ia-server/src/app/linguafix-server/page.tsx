'use client'
import { addUser, GenericComponents, getUsers, SignedContent, UserDocument } from '@gind-ia-platform/generic-components';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';


export default function LinguafixServer() {
  const [users, setUsers] = useState<UserDocument[]>()
  const [cpt, setCpt] = useState<number>(0)

  useEffect(() => {
    const getAwaitUsers = async () =>  {
      const users = await getUsers()
      if (users) {
        setCpt(users.length+1)
        setUsers(users)
      }
    }

    getAwaitUsers()

  }, [cpt])

  const createNewUser = (name:string) => {

    const addUserAwait = async (name:string) => {
      const newUser:UserDocument = {
        name: name,
        phone : "06",
        email: "juju_" + cpt + "@juju.com",
        createdAt: new Date(),
        updatedAt : new Date(),
        image: "",
        password: "jojo"
      }
      await addUser(newUser)
      setCpt(cpt+1)
    }
    addUserAwait(name)
  }

  return (
    <SignedContent publicContent={<h3>Public</h3>}>
    <div className={styles['container']}>
      <GenericComponents></GenericComponents>
      <h4>Link to <Link href="/">Home</Link></h4>
      <ul>
        {users && users.map((u,i) => <li key={i+""}>{u.email}</li>)}
      </ul>
      <button onClick={() => createNewUser("juju")}>Add</button>
    </div>
    </SignedContent>
  );
}
