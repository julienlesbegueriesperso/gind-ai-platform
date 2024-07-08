'use client'
import { addUser, GenericComponents, getUser, getUsers, GindIAContext, SignedContent, UserDocument } from '@gind-ia-platform/generic-components';
import styles from './page.module.css';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';



export default function LinguafixServer() {


  const context = useContext(GindIAContext)

  useEffect(() => {
    console.log("===")
    console.log(context)
  }, [context])

  // useEffect(() => {
  //   const getAwaitUsers = async () =>  {
  //     const users = await getUsers()
  //     if (users) {
  //       setCpt(users.length+1)
  //       setUsers(users)
  //     }
  //   }

  //   getAwaitUsers()

  // }, [cpt])

  // const createNewUser = (name:string) => {

  //   const addUserAwait = async (name:string) => {
  //     const newUser:UserDocument = {
  //       name: name,
  //       phone : "06",
  //       email: "juju_" + cpt + "@juju.com",
  //       createdAt: new Date(),
  //       updatedAt : new Date(),
  //       image: "",
  //       password: "jojo"
  //     }
  //     await addUser(newUser)
  //     setCpt(cpt+1)
  //   }
  //   addUserAwait(name)
  // }

  return (
    <SignedContent publicContent={<h3>Public</h3>}>
    <div className={styles['container']}>
      <GenericComponents></GenericComponents>
      <h4>Link to <Link href="/">Home</Link></h4>
      {context && <div>CONTEXT</div>}
      {context && context.currentUser && <h2>{JSON.stringify(context.currentUser)||""}</h2>}
      {/* <ul>
        {users && users.map((u,i) => <li key={i+""}>{u.email}</li>)}
      </ul> */}
      <button onClick={() => {}}>Add</button>
    </div>
    </SignedContent>
  );
}
