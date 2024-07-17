import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/get-weather-forecast", async (req, res) => {

    try {
        
        if (!req.body.lat && !req.body.long) {
            res.redirect("/");
        } else {
            const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
                params: {
                    latitude: parseFloat(req.body.lat),
                    longitude: parseFloat(req.body.long),
                    current: ["temperature_2m", "rain"],
                    daily: ["temperature_2m_max" , "temperature_2m_min", "precipitation_hours"]
                }
            });
            
            res.render("index.ejs", {
                current_weather: response.data.current.temperature_2m,
                current_rain: response.data.current.rain,
                time: response.data.daily.time,
                temp_min: response.data.daily.temperature_2m_min,
                temp_max: response.data.daily.temperature_2m_max,
                rain: response.data.daily.precipitation_hours
            });
        }

    } catch (error) {
        console.log(error);
    }

});

app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
});