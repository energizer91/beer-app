import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Beer, BeerMeta, FilterParams, SORT } from '../../types';
import { fetchData, fetchMeta } from './utils';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Link,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import {
  FilterAlt,
  FilterAltOff,
  Map,
  Link as LinkIcon,
} from '@mui/icons-material';
import { getLocation } from '../Beer/utils';

const labels = {
  name: 'Name',
  city: 'City',
  state_province: 'State/Province',
  postal_code: 'Postal code',
  country: 'Country',
  brewery_type: 'Type',
};

const filterLabels: Record<keyof typeof labels, keyof FilterParams> = {
  name: 'by_name',
  city: 'by_city',
  state_province: 'by_state',
  postal_code: 'by_postal',
  country: 'by_country',
  brewery_type: 'by_type',
};

const componentMap: Partial<
  Record<keyof typeof labels, (beer: Beer) => ReactNode>
> = {
  name: (beer) => (
    <Link component={RouterLink} to={`/beer/${beer.id}`}>
      {beer.name}
    </Link>
  ),
};

interface BeerListProps {
  loading: boolean;
  rowsPerPage: number;
  beerList: Beer[];
}

const TableContent = ({ loading, beerList, rowsPerPage }: BeerListProps) => {
  if (loading) {
    return (
      <TableBody>
        {Array.from({ length: rowsPerPage }).map((_, i) => (
          <TableRow hover key={`skeleton_${i}`}>
            {(Object.keys(labels) as Array<keyof typeof labels>).map((f) => (
              <TableCell key={f}>
                <Skeleton />
              </TableCell>
            ))}
            <TableCell>
              <Skeleton height={40} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  return (
    <TableBody>
      {beerList.map((beer) => (
        <TableRow hover key={beer.id}>
          {(Object.keys(labels) as Array<keyof typeof labels>).map((f) => (
            <TableCell key={f}>{componentMap[f]?.(beer) || beer[f]}</TableCell>
          ))}
          <TableCell>
            <IconButton href={getLocation(beer)}>
              <Map />
            </IconButton>
            {beer.website_url && (
              <IconButton href={beer.website_url}>
                <LinkIcon />
              </IconButton>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

const BeerList = () => {
  const [sort, setSort] = useState<SORT>('asc');
  const [sortLabel, setSortLabel] = useState<keyof Beer>('name');
  const [filters, setFilters] =
    useState<Partial<Record<keyof FilterParams, string>>>();
  const [filtersApplied, setFiltersApplied] = useState<typeof filters>();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [beerList, setBeerList] = useState<Beer[]>([]);
  const [meta, setMeta] = useState<BeerMeta>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData({
      sort: sortLabel + ':' + sort,
      page: page + 1,
      per_page: rowsPerPage,
      ...filtersApplied,
    })
      .then(setBeerList)
      .then(() => setLoading(false));
  }, [filtersApplied, page, rowsPerPage, sort, sortLabel]);

  useEffect(() => {
    fetchMeta(filtersApplied).then(setMeta);
  }, [filtersApplied]);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  const handleChangeSort = useCallback(
    (label: keyof Beer) => () => {
      const isAsc = sortLabel === label && sort === 'asc';

      setSort(isAsc ? 'desc' : 'asc');
      setSortLabel(label);
    },
    [sort, sortLabel]
  );

  const handleChangeFilter = useCallback(
    (label: keyof typeof labels) => (e: ChangeEvent<HTMLInputElement>) => {
      const key: keyof FilterParams = filterLabels[label];

      if (!key) return;

      const newFilters = Object.assign({}, filters);

      if (!newFilters[key]) {
        newFilters[key] = '';
      }

      newFilters[key] = e.target.value;

      setFilters(newFilters);
    },
    [filters]
  );

  const handleFiltersApply = useCallback(() => {
    setPage(0);
    setFiltersApplied(filters);
  }, [filters]);

  const handleFiltersClear = useCallback(() => {
    setFiltersApplied(undefined);
    setFilters(undefined);
  }, []);

  const handleFiltersOpen = useCallback(() => {
    setFiltersOpen(!filtersOpen);
  }, [filtersOpen]);

  return (
    <Paper component="article">
      <Box component="section" p={3}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          component="header"
          direction="row"
        >
          <Typography variant="h4" component="h1">
            BeerList page
          </Typography>
          <IconButton disabled={loading} onClick={handleFiltersOpen}>
            {filtersOpen ? <FilterAltOff /> : <FilterAlt />}
          </IconButton>
        </Stack>
        <main>
          <Collapse in={filtersOpen}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              {(Object.keys(labels) as Array<keyof typeof labels>).map((f) => (
                <TextField
                  key={f}
                  variant="standard"
                  size="small"
                  value={filters?.[filterLabels[f]] || ''}
                  onChange={handleChangeFilter(f)}
                  label={`${labels[f]}...`}
                  disabled={loading}
                />
              ))}
              <Stack direction="row" spacing={1}>
                <Button disabled={loading} onClick={handleFiltersClear}>
                  Clear
                </Button>
                <Button
                  disabled={loading}
                  variant="contained"
                  onClick={handleFiltersApply}
                >
                  Apply
                </Button>
              </Stack>
            </Stack>
          </Collapse>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {(Object.keys(labels) as Array<keyof typeof labels>).map(
                    (f) => (
                      <TableCell
                        key={f}
                        sortDirection={sortLabel === f ? sort : false}
                      >
                        <TableSortLabel
                          active={sortLabel === f}
                          direction={sortLabel === f ? sort : 'asc'}
                          onClick={handleChangeSort(f)}
                        >
                          {labels[f]}
                        </TableSortLabel>
                      </TableCell>
                    )
                  )}
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableContent
                loading={loading}
                rowsPerPage={rowsPerPage}
                beerList={beerList}
              />
            </Table>
          </TableContainer>
          {!meta ? (
            <Stack direction="row" justifyContent="flex-end" py={2}>
              <Skeleton width={250} height={20} />
            </Stack>
          ) : (
            <TablePagination
              component="div"
              rowsPerPageOptions={[5, 10, 25]}
              count={parseInt(meta.total, 10)}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </main>
      </Box>
    </Paper>
  );
};

export default BeerList;
