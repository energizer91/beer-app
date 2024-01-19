import { useCallback, useEffect, useState } from 'react';
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
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Beer } from '../../types';
import { getFavourites, setFavourites } from './utils';

export const SavedBeerList = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [savedList, setSavedList] = useState<Array<Beer>>([]);

  useEffect(() => {
    getFavourites().then(setSavedList);
  }, []);

  const handleCleanFavourites = useCallback(() => {
    if (selected.length) {
      const newList = savedList.filter((_, i) => !selected.includes(i));

      setFavourites(newList).then((l) => {
        setSavedList(l);
        setSelected([]);
      });
    } else {
      setFavourites([]).then(setSavedList);
    }
  }, [savedList, selected]);

  const handleSelectListItem = useCallback(
    (index: number) => () => {
      const found = selected.indexOf(index);

      if (found < 0) {
        setSelected(selected.concat(index));
      } else {
        setSelected(selected.filter((i) => i !== index));
      }
    },
    [selected]
  );

  return (
    <Paper>
      <Box component="section" p={3}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          component="header"
          direction="row"
        >
          <Typography variant="h4" component="h3">
            Saved items
          </Typography>
          <Button
            onClick={handleCleanFavourites}
            variant="contained"
            size="small"
          >
            {selected.length ? 'Remove selected items' : 'Remove all items'}
          </Button>
        </Stack>
        <List>
          {savedList.map((beer, index) => (
            <ListItem key={beer.id}>
              <ListItemIcon>
                <Checkbox
                  inputProps={{ 'aria-label': 'controlled' }}
                  checked={selected.includes(index)}
                  onChange={handleSelectListItem(index)}
                />
              </ListItemIcon>
              <ListItemText>
                <Link component={RouterLink} to={`/beer/${beer.id}`}>
                  {beer.name}
                </Link>
              </ListItemText>
            </ListItem>
          ))}
          {!savedList.length && <Typography>No saved items</Typography>}
        </List>
      </Box>
    </Paper>
  );
};
