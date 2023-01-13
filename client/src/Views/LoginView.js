import { LoginForm } from '../Components/MyLogin';

function LoginView(props) {
    return (
        <LoginForm login={props.login} />
    )
}

export { LoginView }; 