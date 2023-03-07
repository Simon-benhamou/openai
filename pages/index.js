import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [persona, setPersona] = useState({
    name: "",
    occupation: "",
    age:"",
    location:"" ,
    gender:""

  });
  const [result, setResult] = useState();
  const [loading,setLoading] = useState(false)
  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(persona),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);

      }

      console.log(data)
      setResult(data.result);
      setLoading(false)

      // setPersona({
      //   name: "",
      //   occupation: "",
      //   age:"",
      //   location:"" ,
      //   genre:""
    
      // });
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setLoading(false)

    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main +" "+ styles.flex}>
        <img src="/dog.png" className={styles.icon} />
        <h3>My Persona Generator</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter a persona name"
            value={persona.name}
            onChange={(e) => setPersona({...persona,name:e.target.value})}
          />
          <input
            type="text"
            name="occupation"
            placeholder="Enter a persona Occupation"
            value={persona.occupation}
            onChange={(e) => setPersona({...persona,occupation:e.target.value})}
          />
          <input
            type="text"
            name="age"
            placeholder="Enter the age"
            value={persona.age}
            onChange={(e) => setPersona({...persona,age:e.target.value})}
          />
              <input
            type="text"
            name="genre"
            placeholder="Enter the Genre"
            value={persona.gender}
            onChange={(e) => setPersona({...persona,gender:e.target.value})}
          />
                <input
            type="text"
            name="location"
            placeholder="Enter the Location"
            value={persona.location}
            onChange={(e) => setPersona({...persona,location:e.target.value})}
          />
          <input type="submit" value="Generate persona" />
        </form>
        {loading &&  <div className={styles.spinner}></div> }
        {result && !loading && <div className={styles.result}>
          <div className={styles.profile}>
            <img src={result?.image}/>
            <div>
              <div>{ `${result?.name}(${result?.initial})`}</div>
              <div>{result?.occupation}</div>
              <div>{result?.age}</div>
              <div>{result?.location}</div>
              <div>{result?.gender}</div>
              </div> 
            </div>
          <div>{result?.background}</div>
          <div>{result?.quote}</div>

          
          </div>}
      </main>
    </div>
  );
}
