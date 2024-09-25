import React, { useState } from 'react';
import { User } from '../types/User';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Typography, Box, Grid, Card, CardContent, TablePagination, Button } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import styles from '../styles/UserList.module.scss';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#004b4b',
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  color: theme.palette.common.white,
  '&:hover': {
    color: theme.palette.common.white,
  },
  '&.Mui-active': {
    color: theme.palette.common.white,
  },
  '& .MuiTableSortLabel-icon': {
    color: theme.palette.common.white + ' !important',
  },
}));

interface UserListProps {
    users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortBy, setSortBy] = useState<'name' | 'email'>('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleRequestSort = (property: 'name' | 'email') => {
        const isAsc = sortBy === property && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedUsers = [...users].sort((a, b) => {
        const aValue = sortBy === 'name' ? a.name : a.email;
        const bValue = sortBy === 'name' ? b.name : b.email;

        if (aValue < bValue) {
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const paginatedUsers = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <div className={styles.userListContainer}>
            {isMobile && (
                <Box className={styles.mobileSort}>
                    <Typography variant="subtitle1" gutterBottom align="center">
                        Sort Users
                    </Typography>
                    <div className={styles.sortButtonGroup}>
                        <Button 
                            onClick={() => handleRequestSort('name')}
                            className={`${styles.sortButton} ${sortBy === 'name' ? styles.active : ''}`}
                        >
                            Name
                            {sortBy === 'name' && (
                                <span className={styles.sortIcon}>
                                    {sortOrder === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                                </span>
                            )}
                        </Button>
                        <Button 
                            onClick={() => handleRequestSort('email')}
                            className={`${styles.sortButton} ${sortBy === 'email' ? styles.active : ''}`}
                        >
                            Email
                            {sortBy === 'email' && (
                                <span className={styles.sortIcon}>
                                    {sortOrder === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                                </span>
                            )}
                        </Button>
                    </div>
                </Box>
            )}
            {isMobile ? (
                <Grid container spacing={2}>
                    {paginatedUsers.map(user => (
                        <Grid item xs={12} key={user.id}>
                            <Card className={styles.mobileCard}>
                                <div className={styles.cardHeader}>{user.name}</div>
                                <CardContent className={styles.cardContent}>
                                    <Typography><strong>Email:</strong> {user.email}</Typography>
                                    <Typography><strong>Phone:</strong> {user.phone}</Typography>
                                    <Typography><strong>Website:</strong> {user.website}</Typography>
                                    <Typography>
                                        <strong>Address:</strong> {user.address.street}, {user.address.city}, {user.address.zipcode}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <TableContainer className={styles.tableContainer}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow className={styles.tableHeader}>
                                <StyledTableCell>
                                    <StyledTableSortLabel
                                        active={sortBy === 'name'}
                                        direction={sortBy === 'name' ? sortOrder : 'asc'}
                                        onClick={() => handleRequestSort('name')}
                                    >
                                        Name
                                    </StyledTableSortLabel>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <StyledTableSortLabel
                                        active={sortBy === 'email'}
                                        direction={sortBy === 'email' ? sortOrder : 'asc'}
                                        onClick={() => handleRequestSort('email')}
                                    >
                                        Email
                                    </StyledTableSortLabel>
                                </StyledTableCell>
                                <StyledTableCell>Phone</StyledTableCell>
                                <StyledTableCell>Website</StyledTableCell>
                                <StyledTableCell>Address</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedUsers.map(user => (
                                <TableRow key={user.id} className={styles.tableRow}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.website}</TableCell>
                                    <TableCell>
                                        {user.address.street}, {user.address.city}, {user.address.zipcode}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <TablePagination
                className={styles.pagination}
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default UserList;
