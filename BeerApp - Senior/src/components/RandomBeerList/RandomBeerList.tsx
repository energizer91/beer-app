import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Beer } from '../../types';
import { fetchData } from './utils';

interface BeerListProps {
  loading: boolean;
  beerList: Beer[];
}

const BeerListContent = ({ loading, beerList }: BeerListProps) => {
  if (loading) {
    return (
      <List>
        {Array.from({ length: 10 }).map((_, i) => (
          <ListItem key={`skeleton_${i}`}>
            <Skeleton width={300} />
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <List>
      {!beerList.length && <ListItem>No items found</ListItem>}
      {beerList.map((beer) => (
        <ListItem key={beer.id}>
          <Link component={RouterLink} to={`/beer/${beer.id}`}>
            {beer.name}
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

export const RandomBeerList = () => {
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const [filter, setFilter] = useState('');
  const [filteredBeer, setFilteredBeer] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBeerList = useCallback(() => {
    setLoading(true);
    fetchData()
      .then(setBeerList)
      .then(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadBeerList();
  }, [loadBeerList]);

  useEffect(() => {
    if (!filter) {
      setFilteredBeer(beerList);

      return;
    }

    setFilteredBeer(
      beerList.filter((b) =>
        b.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [beerList, filter]);

  const handleReloadList = useCallback(() => {
    setBeerList([]);
    loadBeerList();
  }, [loadBeerList]);

  const handleFilterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);

  return (
    <Paper>
      <Box component="section" p={3} mb={3}>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          component="header"
          direction="row"
          mb={3}
        >
          <TextField
            size="small"
            label="Filter..."
            variant="outlined"
            onChange={handleFilterChange}
            value={filter}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleReloadList}
            disabled={loading}
          >
            Reload list
          </Button>
        </Stack>
        <BeerListContent loading={loading} beerList={filteredBeer} />
      </Box>
    </Paper>
  );
};
