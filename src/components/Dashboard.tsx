import React, { useEffect, useState, useMemo } from 'react';
import UserList from './UserList';
import { User } from '../types/User';
import { TextField, Container, Select, MenuItem, FormControl, InputLabel, InputAdornment, IconButton, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import styles from '../styles/Dashboard.module.scss';

type FilterType = 'name' | 'email' | 'phone' | 'website' | 'address' | 'all';

const Dashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [filterType, setFilterType] = useState<FilterType>('all');

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const data: User[] = await response.json();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const lowerCaseFilter = filter.toLowerCase();
            switch (filterType) {
                case 'name':
                    return user.name.toLowerCase().includes(lowerCaseFilter);
                case 'email':
                    return user.email.toLowerCase().includes(lowerCaseFilter);
                case 'phone':
                    return user.phone.toLowerCase().includes(lowerCaseFilter);
                case 'website':
                    return user.website.toLowerCase().includes(lowerCaseFilter);
                case 'address':
                    return `${user.address.street}, ${user.address.city}, ${user.address.zipcode}`.toLowerCase().includes(lowerCaseFilter);
                case 'all':
                default:
                    return (
                        user.name.toLowerCase().includes(lowerCaseFilter) ||
                        user.email.toLowerCase().includes(lowerCaseFilter) ||
                        user.phone.toLowerCase().includes(lowerCaseFilter) ||
                        user.website.toLowerCase().includes(lowerCaseFilter) ||
                        `${user.address.street}, ${user.address.city}, ${user.address.zipcode}`.toLowerCase().includes(lowerCaseFilter) ||
                        user.company.name.toLowerCase().includes(lowerCaseFilter)
                    );
            }
        });
    }, [users, filter, filterType]);

    const handleClearFilter = () => {
        setFilter('');
    };

    return (
        <div className={styles.dashboardContainer}>
            <Container>
                <div className={styles.filterContainer}>
                    <Typography variant="h6" gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
                        <FilterListIcon style={{ marginRight: '8px' }} />
                        Filter Users
                    </Typography>
                    <div className={styles.filterRow}>
                        <FormControl variant="outlined" className={styles.filterTypeSelect}>
                            <InputLabel>Filter By</InputLabel>
                            <Select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as FilterType)}
                                label="Filter By"
                            >
                                <MenuItem value="all">All Fields</MenuItem>
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="email">Email</MenuItem>
                                <MenuItem value="phone">Phone</MenuItem>
                                <MenuItem value="website">Website</MenuItem>
                                <MenuItem value="address">Address</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            className={styles.filterInput}
                            label={`Filter by ${filterType === 'all' ? 'any field' : filterType}`}
                            variant="outlined"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {filter && (
                                            <IconButton
                                                aria-label="clear filter"
                                                onClick={handleClearFilter}
                                                edge="end"
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </div>
                <UserList users={filteredUsers} />
            </Container>
        </div>
    );
};

export default Dashboard;
