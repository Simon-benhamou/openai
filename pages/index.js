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
        <title>Persona AI</title>
        <link rel="icon" href="/persona.png" />
      </Head>

      <main className={styles.main +" "+ styles.flex}>
        <img src="/persona.png" className={styles.icon} />
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
          <input type="submit" value={"Generate persona" } />
        </form>
        {loading &&  <div className={styles.spinner}></div> }
        {result && !loading && <div className={styles.result}>
          <div className={styles.profile}>
            <img src={result?.image}/>
            <div>
            <div className={styles.label2}>Name</div>
              <div>{ `${result?.name}(${result?.initial})`}</div>
              <div className={styles.label2}>Occupation</div>

              <div>{result?.occupation}</div>
              <div className={styles.label2}>Age</div>

              <div>{result?.age}</div>
              <div className={styles.label2}>Location</div>

              <div>{result?.location}</div>
              <div className={styles.label2}>Gender</div>

              <div>{result?.gender}</div>
              <div className={styles.label2}>personality type</div>
              <div>{result?.personalityType}</div>
              </div> 
            </div>
            <div>
          <div className={styles.label}>Background</div>
          <div className={styles.descriptions}>{result?.background}</div>
          <div className={styles.label}>Quote</div>
          <div className={styles.descriptions}>{result?.quote}</div>
          <div className={styles.label}>Needs</div>
          <div className={styles.descriptions}>{result?.needs}</div>
          <div className={styles.label}>Expectation</div>
          <div className={styles.descriptions}>{result?.expectation}</div>
          <div className={styles.label}>Frustration</div>
          <div className={styles.descriptions}>{result?.frustration}</div>

          </div>
          </div>}
      </main>
    </div>
  );
}
