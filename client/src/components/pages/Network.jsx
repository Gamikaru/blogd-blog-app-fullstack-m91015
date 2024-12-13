// Network.jsx
import { Button, InputField, NetworkCard, SelectField } from '@components';
import { useUser } from '@contexts/UserContext';
import userService from '@services/api/userService'; // Ensure this path is correct
import { AnimatePresence, motion } from "framer-motion";
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const searchInputVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { width: '200px', opacity: 1 },
};

const filterDropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

const Network = () => {
    const { user, loading: userLoading } = useUser();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Search and Filter state
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [filters, setFilters] = useState({
        name: "",
        location: "",
        sortBy: "",
    });
    const [search, setSearch] = useState("");

    const filterRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const currentUserId = user.userId || user._id;
                const usersData = await userService.fetchUsersExcept(currentUserId);
                setUsers(usersData);
            } catch (error) {
                setError("Failed to fetch users");
                console.error('Fetch Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleUserClick = useCallback((userId) => {
        navigate(`/profile/${userId}`);
    }, [navigate]);

    // Handle outside click for search and filter
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchInput(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    }, []);

    const debouncedHandleSearchChange = useMemo(
        () => debounce((value) => setSearch(value), 300),
        []
    );

    const handleSearchChange = useCallback((e) => {
        debouncedHandleSearchChange(e.target.value);
    }, [debouncedHandleSearchChange]);

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        const searchLower = search.toLowerCase();

        return users.filter((user) => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const matchesName = !filters.name ||
                fullName.includes(filters.name.toLowerCase());
            const matchesLocation = !filters.location ||
                user.location.toLowerCase().includes(filters.location.toLowerCase());
            const matchesSearch = !search ||
                (fullName.includes(searchLower) ||
                    user.location.toLowerCase().includes(searchLower));

            return matchesName && matchesLocation && matchesSearch;
        });
    }, [users, filters, search]);

    const sortedUsers = useMemo(() => {
        const sorted = [...filteredUsers];
        if (filters.sortBy === "name") {
            sorted.sort((a, b) => {
                const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });
        } else if (filters.sortBy === "posts") {
            sorted.sort((a, b) => (b.postCount || 0) - (a.postCount || 0));
        } else if (filters.sortBy === "rating") {
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (filters.sortBy === "location") {
            sorted.sort((a, b) => a.location.localeCompare(b.location));
        }
        return sorted;
    }, [filteredUsers, filters.sortBy]);

    const resetFilters = useCallback(() => {
        setFilters({
            name: "",
            location: "",
            sortBy: "",
        });
        setSearch("");
    }, []);

    if (loading || userLoading) {
        return <div className="network-page__messages--loading">Loading...</div>;
    }

    if (error) {
        return <div className="network-page__messages--error">Error: {error}</div>;
    }

    return (
        <div className="network-page">
            <div className="network-container__filter-search-container">

                {/* Filter Functionality */}
                <div className="network-container__filter-container" ref={filterRef}>
                    <Button
                        className="network-container__icon"
                        onClick={() => setShowFilterDropdown((prev) => !prev)}
                        variant="iconButton"
                        aria-label="Filter"
                    >
                        <FaFilter />
                    </Button>
                    <AnimatePresence>
                        {showFilterDropdown && (
                            <motion.div
                                className="network-container__dropdown"
                                variants={filterDropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <div className="network-container__option">
                                    <InputField
                                        label="Name"
                                        name="name"
                                        value={filters.name}
                                        onChange={handleFilterChange}
                                        placeholder="Filter by name"
                                        aria-label="Filter by name"
                                    />
                                </div>
                                <div className="network-container__option">
                                    <InputField
                                        label="Location"
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        placeholder="Filter by location"
                                        aria-label="Filter by location"
                                    />
                                </div>
                                <div className="network-container__option">
                                    <SelectField
                                        options={[
                                            { label: 'None', value: '' },
                                            { label: 'Name', value: 'name' },
                                            { label: 'Number of Posts', value: 'posts' },
                                            { label: 'Highest Rating', value: 'rating' },
                                            { label: 'Location', value: 'location' },
                                        ]}
                                        value={filters.sortBy}
                                        onChange={handleFilterChange}
                                        aria-label="Sort users"
                                    />
                                </div>
                                {/* Reset Filters Button */}
                                <div className="network-container__option--actions">
                                    <Button
                                        onClick={resetFilters}
                                        variant="reset"
                                        aria-label="Reset Filters"
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Search Functionality */}
                <div className="network-container__search-container" ref={searchRef}>
                    <Button
                        className="network-container__icon"
                        onClick={() => setShowSearchInput((prev) => !prev)}
                        variant="iconButton"
                        aria-label="Search"
                    >
                        <FaSearch />
                    </Button>
                    <AnimatePresence>
                        {showSearchInput && (
                            <motion.div
                                className="network-container__search-input-wrapper"
                                variants={searchInputVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                transition={{ duration: 0.3 }}
                            >
                                <InputField
                                    value={search}
                                    onChange={handleSearchChange}
                                    placeholder="Search by name or location"
                                    aria-label="Search input"
                                    className="network-container__search-input"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <motion.div
                className="network-page__grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {sortedUsers.length === 0 ? (
                        <motion.p
                            className="network-page__messages--no-users"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            No users found.
                        </motion.p>
                    ) : (
                        sortedUsers.map((user) => (
                            <motion.div
                                className="network-page__grid__item"
                                key={user._id}
                                variants={cardVariants}
                            >
                                <div
                                    className="network-page__grid__item__user-card"
                                    onClick={() => handleUserClick(user._id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <NetworkCard
                                        user={user}
                                    />
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );

};

export default Network;