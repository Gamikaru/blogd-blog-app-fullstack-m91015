import React from "react";
import { Card } from "react-bootstrap";

export default function Network() {
	const users = [
		{
			id: "1",
			first_name: "Ash",
			last_name: "Ketchum",
			email: "ash.ketchum@pokedex.com",
			occupation: "Pokémon Trainer",
			location: "Pallet Town",
			status: "Active",
			latest_post: "Just caught a new Pikachu!",
		},
		{
			id: "2",
			first_name: "Misty",
			last_name: "Williams",
			email: "misty.williams@pokedex.com",
			occupation: "Gym Leader",
			location: "Cerulean City",
			status: "Inactive",
			latest_post: "Stoked to be leading the Cerulean Gym!",
		},
		{
			id: "3",
			first_name: "Brock",
			last_name: "Harrison",
			email: "brock.harrison@pokedex.com",
			occupation: "Rock-type Specialist",
			location: "Pewter City",
			status: "Active",
			latest_post: "Just caught a Geodude!",
		},
		{
			id: "4",
			first_name: "Lily",
			last_name: "Tsurugi",
			email: "lily.tsurugi@pokedex.com",
			occupation: "Pokémon Researcher",
			location: "Alola Region",
			status: "Active",
			latest_post: "Discovered a new species of Pokémon!",
		},
		{
			id: "5",
			first_name: "Cynthia",
			last_name: "Shinoda",
			email: "cynthia.shinoda@pokedex.com",
			occupation: "Champion",
			location: "Sinnoh Region",
			status: "Inactive",
			latest_post: "Defended my title as Champion!",
		},
		{
			id: "6",
			first_name: "Dawn",
			last_name: "Berlitz",
			email: "dawn.berlitz@pokedex.com",
			occupation: "Pokémon Coordinator",
			location: "Twinleaf Town",
			status: "Active",
			latest_post: "Just won a Pokémon Contest!",
		},
		{
			id: "7",
			first_name: "Lucas",
			last_name: "Fortune",
			email: "lucas.fortune@pokedex.com",
			occupation: "Pokémon Trainer",
			location: "Twinleaf Town",
			status: "Inactive",
			latest_post: "Just caught a new Turtwig!",
		},
		{
			id: "8",
			first_name: "Hilbert",
			last_name: "Schwarz",
			email: "hilbert.schwarz@pokedex.com",
			occupation: "Pokémon Trainer",
			location: "Accumula Town",
			status: "Active",
			latest_post: "Just defeated the Unova League!",
		},
		{
			id: "9",
			first_name: "Cheren",
			last_name: "Bouffalant",
			email: "cheren.bouffalant@pokedex.com",
			occupation: "Pokémon Researcher",
			location: "Aspertia City",
			status: "Active",
			latest_post: "Discovered a new Pokémon habitat!",
		},
	];

	const getInitials = (first_name, last_name) => {
		if (first_name && last_name) {
			return `${first_name.charAt(0)}${last_name.charAt(0)}`;
		}
		return "";
	};

	return (
		<div className="network-container">
			{users.map((user) => (
				<Card key={user.id} className="network-card">
					<Card.Body className="network-card-body">
						<div className="top-section">
							<div className="initials">
								{getInitials(user.first_name, user.last_name)}
							</div>
							<div className="user-info">
								<h5>{`${user.first_name} ${user.last_name}`}</h5>
								<p>Email: {user.email}</p>
								<p>Occupation: {user.occupation}</p>
								<p>Location: {user.location}</p>
							</div>
						</div>
						<div className="user-status">
							<p>Status: {user.status}</p>
						</div>
						<div className="recent-post">
							<h6>Latest Post:</h6>
							<p>{user.latest_post}</p>
						</div>
					</Card.Body>
				</Card>
			))}
		</div>
	);
}
