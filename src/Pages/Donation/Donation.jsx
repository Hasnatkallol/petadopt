import React, { useEffect, useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
} from '@mui/material';

const Donation = () => {
  const [visibleCampaigns, setVisibleCampaigns] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchCampaigns = async (pageNumber) => {
    const res = await fetch(`http://localhost:5000/donationPetDb?page=${pageNumber}&limit=9`);
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCampaigns(1);
        setVisibleCampaigns(data);
        setPage(2);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const loadMore = async () => {
    if (loading || endReached) return;

    setLoading(true);

    // Wait 4 seconds before showing loading message
    await delay(4000);

    // Show loading message for 2 seconds
    await new Promise((resolve) => {
      setTimeout(resolve, 0); // ensure setLoading(true) took effect
      setTimeout(resolve, 2000);
    });

    try {
      const data = await fetchCampaigns(page);
      if (data.length === 0) {
        setEndReached(true);
      } else {
        setVisibleCampaigns((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !loading &&
        !endReached
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loading, endReached, page]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Donation Campaigns
      </Typography>

      <Grid container spacing={3}>
        {visibleCampaigns.map((pet) => (
          <Grid item xs={12} sm={6} md={4} key={pet._id}>
            <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={pet.petImage}
                alt={pet.petName}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {pet.petName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Max Donation:</strong> ${pet.maximumDonationAmount}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  <strong>Donated:</strong> ${pet.donatedAmount}
                </Typography>
                <Button variant="contained" fullWidth>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        {loading && (
          <>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading more...
            </Typography>
          </>
        )}
        {endReached && !loading && (
          <Typography variant="body1">No more campaigns.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Donation;
