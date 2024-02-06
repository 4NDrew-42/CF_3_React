export const LoginView = () => {
    return (
        <form>
            <label>
                Username:
                <input type="text" placeholder="Username" />
            </label>
            <label>
                Password:
                <input type="password" placeholder="Password" />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};
