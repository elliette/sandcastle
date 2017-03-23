import React, {Component} from 'react';
import firebase from 'firebase';
import { browserHistory } from 'react-router';

export default class SignUp extends Component {
	constructor(props){
		super(props)
		this.state = {
			firstname: "",
			lastname: "",
			email: "",
			password: "", 
			signedUp: false 
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleSubmit(event){
		event.preventDefault();
		this.setState( { signedUp: true } ); 
		const email = this.state.email;
		const password = this.state.password;
		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(() => firebase.auth().signInWithEmailAndPassword(email, password))
		.then( () => {
            const user = firebase.auth().currentUser;
            console.log('user on sign in', user)
            const userId = user.uid;
            this.props.handlers.handleSignin(userId);

            axios.post('/setUser', {userId: userId})
            .then(() => {
                console.log('posting userid');
            })
            .catch(console.error);
        })
        .catch(err => alert("Invalid sign up!"))
    }
	};

	handleChange(event){
		const value = event.target.value;
		const name = event.target.name;
		this.setState({ [name]: value })
	}

	render(){
	return (
		<div> 
		{ this.state.signedUp ?

			( <div>Thanks for signing up! Please log into begin your first project.</div>)
			: ( <div className="container-fluid">
				<div className="row">
			        <form>
			            <div className="form-group">
			                <label htmlFor="title" className="col-sm-2 control-label">First Name</label>
			                <div className="col-sm-10">
			                    <input name="firstname" type="text" className="form-control" onChange={this.handleChange} />
			                </div>
			            </div>
			          	<div className="form-group">
			                <label htmlFor="title" className="col-sm-2 control-label">Last Name</label>
			                <div className="col-sm-10">
			                    <input name="lastname" type="text" className="form-control" onChange={this.handleChange} />
			                </div>
			            </div>
			            <div className="form-group">
			                <label htmlFor="title" className="col-sm-2 control-label">Email</label>
			                <div className="col-sm-10">
			                    <input name="email" type="text" className="form-control" onChange={this.handleChange} />
			                </div>
			            </div>
			          	<div className="form-group">
			                <label htmlFor="title" className="col-sm-2 control-label">Password</label>
			                <div className="col-sm-10">
			                    <input name="password" type="password" className="form-control" onChange={this.handleChange} />
			                </div>
			            </div>

			            <div className="col-sm-offset-2 col-sm-10">
			                <button onClick={this.handleSubmit} type="submit" className="btn btn-primary">Sign Up</button>
			            </div>
			        </form>
		        </div>
			    </div>
			  ) 
		} 
		</div> 
		)

	}


}
