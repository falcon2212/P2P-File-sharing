export function validate_user(props) {
    fetch("https://localhost:3080/users/find", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: props.user.username, password: props.user.password})
    })
        .then(res => res.json())
        .then(
            res => {
                console.log(res);
                if (res.name !== "") {
                    console.log("fuck");
                    // this.props.onReq(true, {username:res.username, name: res.name});
                    props.handleValid(res.name);
                }
            })
        .catch(
            err => {
                console.log(err);
            });
}