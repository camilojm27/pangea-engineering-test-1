import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../../API"; // Adjust this import to your actual API client's location
import {
  Typography,
  Box,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Avatar, Card, CardContent, CardHeader} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

import blitzLogo from "../../../Components/globalAssets/platty.png";
import routes from "../../../Config/routes";
import profilePhoto from "../../../Components/globalAssets/ppfLogo.png"; // Placeholder for the profile photo
const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json";
const mapCountryToIsoA3 = (country) => {
  const countryMap = {
    USA: "USA",
    UK: "GBR",
    Mexico: "MEX",
    Canada: "CAN",
    Colombia: "COL",
    // Add more mappings as necessary
  };
  return countryMap[country] || null;
};
const CreatorDetailsPage = () => {
  const { creatorId } = useParams();
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCreatorDetails = async () => {
      setLoading(true);
      try {
        const response = await client.creators.fetchDetails(creatorId);
        console.log("Received response:", response);
        console.log(client);

        // Directly use the response assuming 'response' already contains the data object
        if (response && Object.keys(response).length > 0) {
          setCreatorDetails(response); // Assuming 'response' is the data object you need
          console.log("Data set for creator:", response);
        } else {
          console.error("Data is empty or undefined.", response);
        }
      } catch (error) {
        console.error("Failed to fetch creator details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (creatorId) {
      fetchCreatorDetails();
    }
  }, [creatorId]);

  if (loading) {
    return <Typography>Loading creator details...</Typography>;
  }

  if (!creatorDetails) {
    return <Typography>No creator details found.</Typography>;
  }
  const highlightedCountries = ["USA", "UK", "Mexico", "Canada", "Colombia"]
    .map(mapCountryToIsoA3)
    .filter(Boolean);

  // Safely parse and calculate data for charts
  const followersData = [
    { name: "TikTok", value: parseInt(creatorDetails.tiktok || 0, 10) },
    { name: "Instagram", value: parseInt(creatorDetails.instagram || 0, 10) },
    { name: "YouTube", value: parseInt(creatorDetails.youtube || 0, 10) },
  ];
  const formatPromotionValue = value => {
    const numericValue = parseFloat(value.replace('$', '').replace(',', '') || 0);
    return numericValue > 999 ? numericValue.toLocaleString() : numericValue.toFixed(2);
  };
  const promotionData = [
    {
      name: "TikTok Sound",
      value: (creatorDetails.tiktok_sound),
    },
    {
      name: "TikTok Brand",
      value: (creatorDetails.tiktok_brand),
    },
    {
      name: "Instagram Sound",
      value: (creatorDetails.instagram_sound),
    },
    {
      name: "Instagram Brand",
      value: (creatorDetails.instagram_brand),
    },
  ];
  

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "#000" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            onClick={() => navigate(routes.home)}
            sx={{ mr: 2 }}
          >
            <img
              src={blitzLogo}
              alt="logo"
              style={{ width: "120px", height: "50px" }}
            />
          </IconButton>
          {/* Navigation items here, if any */}
        </Toolbar>
      </AppBar>

      <section>
        
        <Grid container justifyContent="center" spacing={6} style={{
          backgroundColor: "rgb(243 244 246)",
          padding: "100px",
          margin: "auto",
          borderRadius: "15px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",

        }}>
          <Grid item xs={12} md={6} lg={4} style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            borderRadius: "15px",
            border: "1px solid #ccc",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            backgroundColor: "rgba(255,255,255,0.3)"
          }}>
              <Avatar alt="Profile picture" src={creatorDetails.pfphref || profilePhoto}
 sx={{ width: 120, height: 120 }}>
                JD
              </Avatar>
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Presented By: {creatorDetails.manager}

                </Typography>
                <Typography variant="body1">
                  <strong>TikTok Followers:</strong> {creatorDetails.tiktok}
                </Typography>
                <Typography variant="body1">
                  <strong>Instagram Followers:</strong> {creatorDetails.instagram}
                </Typography>
                <Typography variant="body1">
                  <strong>YouTube Subscribers:</strong> {creatorDetails.youtube}
                </Typography>
              </div>
              <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 600 }}>
               Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid dolore non 
               magni consectetur iste suscipit ad aut, sequi saepe ullam adipisci, quo deleniti 
               amet similique dolorum! Harum ab ducimus fuga.
              </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Grid container direction="row"  justifyContent="space-evenly" alignItems="center" textAlign="center" style={
              {
                marginTop: "20px",             }
            }>
              <SocialLink icon={<InstagramIcon />} text="Instagram" link={creatorDetails.instagram_link}/>
              <SocialLink icon={<TwitterIcon />} text="Twitter" link={creatorDetails.twitter_link} />
              <SocialLink icon={<YouTubeIcon />} text="YouTube" link={creatorDetails.youtube_link} />
              <SocialLink icon={<YouTubeIcon />} text="TikTok" link={creatorDetails.tiktok_link} />
            </Grid>
          </Grid>
        </Grid>
      </section>
      <section style={{
        padding: "30px",
      }}>
        <Grid container spacing={8} justifyContent="center">
          {[
            { title: 'Instagram Followers', id: 'Instagram' },
            { title: 'Twitter Followers', id: 'Twitter' },
            { title: 'YouTube Subscribers', id: 'YouTube' },
            { title: 'TikTok Followers', id: 'TikTok' }
          ].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card elevation={3} style={{
                borderRadius: "25px"
              }}>
                <CardHeader
                  title={<span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333'}}>{item.title}</span>}
                />
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={followersData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {followersData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={["#0088FE", "#00C49F", "#FFBB28"][index % 3]} // Use modulo to repeat colors
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* Promotion Rates */}
        <Paper sx={{ padding: 2, margin: "20px 0" }}>
          <Typography variant="h6" gutterBottom>
            Promotion Rates ($)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={promotionData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <List>
            {promotionData.map((data) => (
              <ListItem key={data.name}>
                <ListItemText
                  primary={`${data.name}: $${(data.value)}`}
                />
              </ListItem>
            ))}
          </List>
          
        </Paper>
        
      </section>

      
      {/* Additional Details */}
      <Paper sx={{ padding: 2, margin: "20px 0" }}>
        <Typography variant="body1">
          <strong>Geolocation & Ethnicity:</strong>{" "}
          {creatorDetails.geolocation_gender_ethnicity}
        </Typography>
        <Typography variant="body1">
          <strong>Content Style:</strong> {creatorDetails.notes_content_style}
        </Typography>
        <ComposableMap>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isHighlighted = highlightedCountries.includes(geo.properties.ISO_A3);
                return isHighlighted ? (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#FF5533"
                  />
                ) : null; // Don't render unhighlighted geographies to clean up the map
              }).length > 0 ? geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#DDD"
                />
              )) : <Typography sx={{ textAlign: 'center' }}>Creator can't be mapped.</Typography>
            }
          </Geographies>
         </ComposableMap>
        </Paper>

    </div>
  );
};

function SocialLink({ icon, text, link }) {
  return (
    <>
      {link && (
          <Typography  style={{
              fontSize: "40px",
          }}>
            {icon}
            <a href={link} rel="noopener noreferrer" target="_blank" 
            style={{
              fontSize: "30px",
              color: "gray",
              hover: "black",

          }}
            >
              {text}
            </a>
          </Typography>
      )}
    </>
  );
}


export default CreatorDetailsPage;
