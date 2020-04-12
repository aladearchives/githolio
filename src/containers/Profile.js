import React from "react";
import Link from "../components/Link/Link";
import styled from "styled-components";
import List from "../components/List";

const ProfileContainer = styled.div`
  width: 50%;
  margin: 10px auto;
`;

const ProfileAvatar = styled.img`
  width: 150px;
`;

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {},
      repositories: [],
      loading: true,
    };
  }
  async componentDidMount() {
    try {
      const profile = await fetch("https://api.github.com/users/aladearchives");
      const profileJSON = await profile.json();

      if (profileJSON) {
        const repositories = await fetch(profileJSON.repos_url);
        const repositoriesJSON = await repositories.json();
        this.setState({
          data: profileJSON,
          repositories: repositoriesJSON,
          loading: false,
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: error.message,
      });
    }
  }
  render() {
    const { data, loading, repositories, error } = this.state;
    if (loading || error) {
      return <div>{loading ? "Loading..." : error}</div>;
    }
    const items = [
      {
        label: "HTML URL: ",
        value: <Link url={data.html_url} title="Github URL" />,
      },
      { label: "REPOS URL: ", value: data.repos_url },
      { label: "Name: ", value: data.name },
      { label: "Company: ", value: data.company },
      { label: "Location: ", value: data.location },
      { label: "Email: ", value: data.email },
      { label: "Bio: ", value: data.bio },
    ];

    const projects = repositories.map((repository) => ({
      label: repository.name,
      value: <Link url={repository.html_url} title="Github URL" />,
    }));

    return (
      <ProfileContainer>
        <ProfileAvatar src={data.avatar_url} alt="Avatar"></ProfileAvatar>
        <List title="Profile" items={items} />
        <List title="Projects" items={projects} />
      </ProfileContainer>
    );
  }
}
export default Profile;
