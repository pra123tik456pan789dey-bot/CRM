const apiKey = "AIzaSyAto2psDMYdt-q-I_fSltgv6v5HbvC9XCg";
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    const models = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    console.log(models.map(m => m.name));
  })
  .catch(err => console.error(err));
