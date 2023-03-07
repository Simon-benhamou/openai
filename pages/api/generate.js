import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const persona = req.body || '';
  // if (animal.trim().length === 0) {
  //   res.status(400).json({
  //     error: {
  //       message: "Please enter a valid animal",
  //     }
  //   });
  //   return;
  // }
  try {
    const background = await getBackground(persona)
    const quote = await getQuote(persona)
    const image = await getPersonaImage(persona)
    const initial =  persona.name.split(" ").map((val) => val.charAt(0)).slice(0, 2).join("")



    const result = {...persona,background:background, quote: quote,initial:initial,image:image }
    res.status(200).json({ result: result});
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
const getBackground = async (persona) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePromptBackground(persona),
    max_tokens:100,
    temperature: 0.6,
  });
  return completion.data.choices[0].text
}
const getQuote = async (persona) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePromptQuote(persona),
    max_tokens:40,
    temperature: 0.6,
  });
  return completion.data.choices[0].text
}
const getPersonaImage = async(persona) => {
  const response = await openai.createImage({
    prompt: `a face  picture  professional for marketing of ${persona.gender} of ${persona.age} years old`,
    n: 1,
    size: "512x512",
  });
  return  response.data.data[0].url;
}

/*   Needs: "A centralized way of being introduced to the new medical products on the market, as well as the research around each",
  Expectation:"For pharma companies to provide relevant research when launching new medical products",
  Frustration:"Having a variety of medical reps being scheduled in her day each introducing new medication, taking up consulting time. As well as attending product launches where marketing is the focus rather than the research and patient impact around the product",
  personalityType:"Rational",
  Quote:""The good physician treats the disease; the great physician treats the patient who has the disease." - William Osler"
  Needs: "A simple way to locate medical records and contact the doctors holding these records",
  Expectation:"Efficient processes with minimum waiting time between steps",
  Frustration:"Waiting without knowing what's going on, not being in control of a process, shouts",
  personalityType:"Guardian",
  Quote:""A professional lawyer is one that controls all the aspects of a process in order to Win!
  */
function generatePromptBackground(persona) {

  return`suggest me a background for a ${persona.gender} named ${persona.name} of ${persona.age} years old,  that works in ${persona.occupation} in ${persona.location}
  without repeating the ${persona.name} is a ${persona.occupation} of ${persona.age} years old.
    for Example :
    suggest me a background for a  Female named Amelia Schmidt of 52 years old,  that works as a Psychiatrist in Germany would be :
    Amelia is a practicing psychiatrist. She has many years of experience assisting patients of all ages suffering from various forms of depression. She is also a mother of 2 grown up children and continues to juggle the demands of being a parent and medical professional
   ` 
}
function generatePromptQuote(persona) {
  return`suggest me a quote that a ${persona.occupation} of ${persona.age} years old,  would say.
    for Example :
    suggest me a quote that a Psychiatrist of 52  years old,  would say would be :
    The good physician treats the disease; the great physician treats the patient who has the disease." - William Osler
   ` 
}
/*`base of the following userRequest object, build the following persona object with all its attribute including background and initial. 
  the background is an example of the occupation and location and also the gender. 
  userRequest : {
    name:"Amelia Schmidt",
    age:"52",
    location:"Germany",
    occupation:"Psychiatrist",
    gender:"Female"
    
  },
 persona:  {
  name:"Amelia Schmidt",
  age:"52",
  location:"Germany",
  initial:"AS"
  occupation:"Psychiatrist",
  gender:"Female"",
  background:"Amelia is a practicing psychiatrist. She has many years of experience assisting patients of all ages suffering from various forms of depression. She is also a mother of 2 grown up children and continues to juggle the demands of being a parent and medical professional"

  },
  userRequest : {
    name:"Dirk Bekker",
    age:"35",
    location:"Munich, Germany",
    occupation:"Lawyer",
    gender:"Male"
    
  },
 persona:  {
  name:"Dirk Bekker",
  age:"35",
  location:"Munich, Germany",
  occupation:"Lawyer",
  gender:"Male"
  initial:"RR"
  background:"Dirk is a lawyer in the field of health claims. He spends his day receiving requests of patients to sue institutions and performing at court"

  },
  userRequest: {
    name: ${persona.name},
    age:${persona.age}",
    location:${persona.location},
    occupation:${persona.occupation},
    gender:${persona.gender}
  },
  persona:`;*/