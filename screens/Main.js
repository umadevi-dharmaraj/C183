import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	StatusBar,
	Platform,
	TouchableOpacity,
	ScrollView,
	Image
} from 'react-native';
import { RFPercentage, RFValue, RFValues } from 'react-native-responsive-fontsize';

import * as Permissions from 'expo-permissions';

import * as FaceDetector from 'expo-face-detector';
import { Camera } from 'expo-camera';

import Filter1 from './Filter1';
import Filter2 from './Filter2';

export default class Main extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			hasCameraPermission: null,
			faces: [],
			current_filter:"filter_1"
		};
		this.onCameraPermission = this.onCameraPermission.bind(this);
		this.onFacesDetected = this.onFacesDetected.bind(this);
		this.onFaceDetectionError = this.onFaceDetectionError.bind(this);
		
	}

	

	componentDidMount() {
		Permissions.askAsync(Permissions.CAMERA).then(this.onCameraPermission);
	}

	onCameraPermission({ status }) {
		this.setState({ hasCameraPermission: status === 'granted' });
	}

	onFacesDetected({ faces }) {
		this.setState({ faces: faces });
	}

	onFaceDetectionError(error) {
		console.log(error);
	}

	render() {
		const { hasCameraPermission } = this.state;
		let data =[
			{
				"id": "1",
				"image": require("../assets/glasses.png")
			},
			{
				"id": "2",
				"image": require("../assets/glasses-round.png")
			}
		]
		if (hasCameraPermission === null) {
			return <View />;
		}
		if (hasCameraPermission === false) {
			return (
				<View style={styles.container}>
					<Text>No access to camera</Text>
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<SafeAreaView style={styles.droidSafeArea} />
				<View style={styles.headingContainer}>
					<View style={{flexDirection:'row', flexWrap:'wrap'}}>
						<Text style={styles.titleText1}>FR</Text>
						<Text style={styles.titleText2}>APP</Text>
					</View>
					<View style={{flexDirection:'row', flexWrap:'wrap'}}>
						<Text style={styles.subheading1}>TRY OUR</Text>
						<Text style={styles.subheading2}>COOL FRAMES</Text>
					</View>

					
				</View>
				<View style={styles.cameraStyle}>
					<Camera
						style={{ flex: 1 }}
						type={Camera.Constants.Type.front}
						faceDetectorSettings={{
							mode: FaceDetector.FaceDetectorMode.fast,
							detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
							runClassifications: FaceDetector.FaceDetectorClassifications.all,
						}}
						onFacesDetected={this.onFacesDetected}
						onFacesDetectionError={this.onFacesDetectionError}
					/>
					{this.state.faces.map((face) => {
						if(this.state.current_filter === 'filter_1'){
							return <Filter1 key={face.faceID} face={face} />;
						}
						else if(this.state.current_filter === 'filter_2'){
							return <Filter2 key={face.faceID} face={face} />;
						}
						
					})}
				</View>
				<View style={styles.framesContainer}>
					<ScrollView style={{flexDirection:"row"}} horizontal showsHorizontalScrollIndicator={false} >
						{
						data.map(filter_data=>{
							return(
								<TouchableOpacity style={styles.filterImageContainer}
									onPress={()=>{
										this.setState({current_filter:`filter_${filter_data.id}`})
									}}>
									<Image source={filter_data.image} style={{height:32, width: 80}}/>

								</TouchableOpacity>
							)
						})
					}

					</ScrollView>

				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	droidSafeArea: {
		marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
	},
	headingContainer: {
		flex: 0.1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor:"#6278e4"
	},
	titleText1: {
		fontSize: RFValue(30),
		fontWeight:"bold",
		color:"#efb141",
		fonStyle: 'italic',
		textShadowColor:'rgba(0,0,0,0.75)',
		textShadowOffset:{width: -3, height:3},
		textShadowRadius: 1
	},
	titleText2: {
		fontSize: RFValue(30),
		fontWeight:"bold",
		color:"white",
		fonStyle: 'italic',
		textShadowColor:'rgba(0,0,0,0.75)',
		textShadowOffset:{width: -3, height:3},
		textShadowRadius: 1
	},
	subheading1:{
		fontSize: RFValue(20),
		color:"#efb141",
		fonStyle: 'italic',
		textShadowColor:'rgba(0,0,0,0.75)',
		textShadowOffset:{width: -3, height:3},
		textShadowRadius: 1

	},subheading2:{
		fontSize: RFValue(20),
		color:"white",
		fonStyle: 'italic',
		textShadowColor:'rgba(0,0,0,0.75)',
		textShadowOffset:{width: -3, height:3},
		textShadowRadius: 1

	},

	framesContainer:{
		flex:0.2,
		paddingLeft: RFValue(20),
		paddingRight:RFValue(20),
		paddingTop:RFValue(30),
		backgroundColor:"#6278e4"
	},
	filterImageContainer: {
		height: RFPercentage(8),
		width:RFPercentage(15),
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:"#e4e7f8",
		borderRadius:30,
		marginRight:20

	},


	cameraStyle: {
		flex: 0.65,
	},
	
});
