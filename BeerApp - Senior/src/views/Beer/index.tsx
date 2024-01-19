import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Beer as IBeer } from '../../types';
import {
  fetchData,
  FieldsByKeyNameMap,
  FieldsKeyConverter,
  getFavourite,
  getFields,
  getLocation,
  setFavourite,
} from './utils';
import { Favorite, FavoriteBorder, Place } from '@mui/icons-material';

const fieldsKeyNameMap: FieldsByKeyNameMap = {
  brewery_type: 'Type',
  name: 'Name',
  address_1: 'Address 1',
  address_2: 'Address 1',
  address_3: 'Address 1',
  city: 'City',
  country: 'Country',
  state_province: 'State/Province',
  postal_code: 'Postal code',
  street: 'Street',
  phone: 'Phone',
  website_url: 'Website URL',
};

const fieldsKeyConverter: FieldsKeyConverter<ReactNode> = {
  website_url: (value) => (
    <Link href={value} target="_blank" rel="noopener noreferrer">
      {value}
    </Link>
  ),
};

const Beer = () => {
  const { id } = useParams();
  const [beer, setBeer] = useState<IBeer | void>();
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetchData(id).then(setBeer);
    getFavourite(id).then(setIsFavourite);
  }, [id]);

  const handleFavourite = useCallback(async () => {
    if (!beer) return;

    const newState = await setFavourite(beer);

    setIsFavourite(newState);
  }, [beer]);

  if (!beer) {
    return (
      <Paper component="article">
        <Box component="section" p={3}>
          <Typography variant="h4" component="h1" mb={3}>
            <Skeleton width={300} />
          </Typography>
          <main>
            <Grid container spacing={2}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Grid key={`skeleton_${i}`} item container xs={12}>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" fontWeight="bold" mb={1}>
                      <Skeleton width={70} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <Skeleton width={120} />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </main>
        </Box>
      </Paper>
    );
  }

  const fields = getFields(beer, fieldsKeyNameMap, fieldsKeyConverter);

  return (
    <Paper component="article">
      <Box component="section" p={3}>
        <Stack
          justifyContent="space-between"
          component="header"
          direction="row"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            {beer.name}
          </Typography>
          <Stack spacing={1} direction="row" alignItems="center">
            <IconButton onClick={handleFavourite}>
              {isFavourite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <Button
              href={getLocation(beer)}
              target="_blank"
              rel="noopener norefferer"
              variant="contained"
              endIcon={<Place />}
            >
              View on map
            </Button>
          </Stack>
        </Stack>
        <main>
          <Grid container spacing={2}>
            {fields.map(([key, value]) => (
              <Grid key={String(key)} item container xs={12}>
                <Grid item xs={12} sm={1}>
                  <Typography variant="body1" fontWeight="bold">
                    {key}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={10}>
                  {value}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </main>
      </Box>
    </Paper>
  );
};

export default Beer;
