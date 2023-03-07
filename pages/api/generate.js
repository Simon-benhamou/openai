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
    const needs = await getPersonaNeeds(persona)
    const frustration = await getPersonaFrustrations(persona)
    const expectation = await getPersonaExpectation(persona)
    const personalityType = await getPersonalityType(persona)


    const result = {...persona,background:background, quote: quote,initial:initial,image:image,needs: needs,frustration: frustration, expectation: expectation,personalityType:personalityType}
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
    max_tokens:256,
    temperature: 0.6,
  });
  return completion.data.choices[0].text
}
const getQuote = async (persona) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePromptQuote(persona),
    max_tokens:256,
    temperature: 0.6,
  });
  return completion.data.choices[0].text
}
const getPersonaImage = async(persona) => {
  const response = await openai.createImage({
    prompt: `a studio picture for marketing of a persona type of ${persona.gender} of ${persona.age} years old`,
    n: 1,
    size: "512x512",
  });
  return  response.data.data[0].url;
}
const getPersonaNeeds = async (persona) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePromptNeeds(persona),
    max_tokens:256,
    temperature: 0.6,
  });
  return completion.data.choices[0].text
}
const getPersonaFrustrations = async (persona) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePromptFrustrations(persona),
    max_tokens:100,
    temperature: 0.6,
  });
  return completion.data.choices[0].text
}
const getPersonaExpectation = async (persona) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePromptExpectation(persona),
    max_tokens:256,
    temperature: 0.6,
  });
  return completion.data.choices[0].text
}
const getPersonalityType = async (persona) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePromptPersonalityType(persona),
    max_tokens:10,
    temperature: 0.6,
  });
  return completion.data.choices[0].text
}
function generatePromptNeeds(persona){
  return `Suggest me the very detailed and low-level requests and whishes (max 2 points) of a ${persona.gender} named ${persona.name}  of ${persona.age} years old that works in/as ${persona.occupation} in ${persona.location} to completing a particular tasks. Write you answer in the language of the word ${persona.gender}`
}
function generatePromptFrustrations(persona){
    return `What can ruin ${persona.name}'s experience and prevent her/him from using your product? List the pain points for a ${persona.gender} named ${persona.name} , ${persona.age} years old that works in/as ${persona.occupation} in ${persona.location}.Write you answer in the language of the word ${persona.gender}.`
}
function generatePromptExpectation(persona){
  return `Suggest me the potential expectations of a  ${persona.gender}  named ${persona.name}, ${persona.age}  years old that works as an ${persona.occupation} regarding the product or product manufacturer/service provider for.
   Most expectations are based on ${persona.name}'s previous experiences (with your competitors or related services) or/and word of mouth. Write you answer in the language of the word ${persona.gender}}`
}
function generatePromptPersonalityType (persona){
    return `What would be the personality type of a ${persona.gender}  named ${persona.name}, ${persona.age} years old that work in  ${persona.occupation} between the 4 following options : Rational, Artisan, Guardian and Idealist. response straight one of 4 options .Write you answer in the language of the word ${persona.gender}`
}
function generatePromptBackground(persona) {

  return`suggest me a background for a ${persona.gender} named ${persona.name} of ${persona.age} years old,  that works in ${persona.occupation} in ${persona.location}
  without repeating the ${persona.name} is a ${persona.occupation} of ${persona.age} years old. Write you answer in the language of the word ${persona.gender}.
    for Example :
    suggest me a background for a  Female named Amelia Schmidt of 52 years old,  that works as a Psychiatrist in Germany would be :
    Amelia is a practicing psychiatrist. She has many years of experience assisting patients of all ages suffering from various forms of depression. She is also a mother of 2 grown up children and continues to juggle the demands of being a parent and medical professional
   ` 
}
function generatePromptQuote(persona) {
  return`suggest me a quote that a ${persona.occupation} of ${persona.age} years old,  would say.In your answer do not write "Answer: ", response straight the quote. Write you answer in the language of the word ${persona.gender}.
    For Example :
    suggest me a quote that a Psychiatrist of 52  years old,  would say would be :
    The good physician treats the disease; the great physician treats the patient who has the disease." - William Osler
   ` 
}
