import React, {Component} from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { uploadProfileImage, deletePhoto, setMainPhoto } from '../userActions';
import {Image, Segment, Icon, Header, Divider, Grid, Button, Card} from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { toastr } from 'react-redux-toastr';


//quering the firestore, getting the photos saved of firestore getting them out using firestoreConnect. using auth as a props to query firestore
const query = ({auth}) => {
    return [
        {
            collection: 'users',
            doc: auth.uid,
            subcollections: [{collection: 'photos'}],
            storeAs:'photos'
        }
    ]
}


const mapDisptchToProps = {
    uploadProfileImage,
    deletePhoto,
    setMainPhoto
}

const mapStateToProps = (state) => ({
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    photos: state.firestore.ordered.photos,
    loading: state.async.loading
})


class PhotosPage extends Component {
    state = {
        files: [],
        fileName:'',
        cropResult:null,
        image:{}
    }

    //uploading image to firestore
    uploadImage = async () => {
        try{
            await this.props.uploadProfileImage(this.state.image, this.state.fileName);
            this.cancelCrop();
            toastr.success('Success', 'Photo has been uploaded')
        }catch(error){
            toastr.error('Oops',error.message);
        }
    }

    //canceling crop after selected
    cancelCrop = () => {
        this.setState({
            files: [],
            image: {}
        })
    }

    //use in Dropzome component for adding image on our app
    onDrop = (files) => {
        this.setState({
            files,
            fileName: files[0].name
        });
    }

    //method to delete photo
    handlePhotoDelete = (photo) => async () => {
        
        try{
            this.props.deletePhoto(photo);
    
        }catch(error){
    
            toastr.error('Oops!',error.message);
        }
    }

    //setting / selecting main photo
    handleSetMainPhoto = (photo) => async () => {
        try{
            this.props.setMainPhoto(photo);
        }catch(error){
            toastr.error('Oops!',error.message);
        }
    }



    //cropping of image
    cropImage = () => {
        
        if(typeof this.refs.cropper.getCroppedCanvas() === 'undefined'){
            return;
        }

        this.refs.cropper.getCroppedCanvas().toBlob(blob => {
            let imageUrl = URL.createObjectURL(blob);

            this.setState({
                cropResult: imageUrl,
                image:blob
            })
        }, 'image/jpeg');
    }

    render() {
        const { photos, profile, loading } = this.props;

        //filtering photo, checking if the main photo is among the photo upload list then display the main photo from the photo upload list
        let filteredPhotos;
        if(photos) {
            filteredPhotos = photos.filter(photo => {
                return photo.url !== profile.photoURL
            })
        }

        return (
            <Segment>
                <Header dividing size='large' content='Your Photos' />
                <Grid>
                    <Grid.Row />
                    <Grid.Column width={4}>
                        <Header color='teal' sub content='Step 1 - Add Photo'/>

                        <Dropzone onDrop={this.onDrop}>
                            <div style={{padding:'30px', textAlign:'center'}}>
                                <Icon name="upload" size="huge"/>
                                <Header content="Drop image here or click to add image"/>
                            </div>
                        </Dropzone>

                    </Grid.Column>
                    <Grid.Column width={1} />
                    <Grid.Column width={4}>
                        <Header sub color='teal' content='Step 2 - Resize image' />

                        {this.state.files[0] &&
                        <Cropper
                            style={{height:200, width:"100%"}}
                            ref="cropper"
                            src={this.state.files[0].preview}
                            aspectRatio={1}
                            viewMode={0}
                            dragMode="move"
                            guides={false}
                            scalable={true}
                            cropBoxMovable={true}
                            cropBoxResizable={true}
                            crop={this.cropImage}
                        />}

                    </Grid.Column>
                    <Grid.Column width={1} />
                    <Grid.Column width={4}>
                        <Header sub color='teal' content='Step 3 - Preview and Upload' />
                        {this.state.files[0] &&
                            <div>
                                <Image style={{minHeight: '200px', minWidth: '200px'}} src={this.state.cropResult} />
                                <Button.Group>
                                    <Button loading={loading} onClick={this.uploadImage} style={{width:'100px'}} positive icon="check"/>
                                    <Button disabled={loading} onClick={this.cropImage} style={{width:'100px'}}  icon="close"/>
                                </Button.Group>
                            </div>
                         }
                    </Grid.Column>

                </Grid>

                <Divider/>
                <Header sub color='teal' content='All Photos'/>

                <Card.Group itemsPerRow={5}>
                    <Card>
                        <Image src={profile.photoURL || '/assets/user.png'}/>
                        <Button positive>Main Photo</Button>
                    </Card>
                    {/* //looping through the avalible photos */}
                    {photos && filteredPhotos.map((photo) => (
                    <Card key={photo.id}>
                            <Image
                                src={photo.url}
                            />
                        <div className='ui two buttons'>
                            <Button onClick={this.handleSetMainPhoto(photo)} basic color='green'>Main</Button>
                            <Button onClick={this.handlePhotoDelete(photo)} basic icon='trash' color='red' />
                        </div>
                    </Card>
                    ))}
                </Card.Group>
            </Segment>
        );
    }
}

export default compose(
    connect(mapStateToProps,mapDisptchToProps),
    firestoreConnect(auth => query(auth))
)(PhotosPage); 