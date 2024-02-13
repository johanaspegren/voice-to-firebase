import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';

import Logo from '../img/aie-logo-white.png';
import videoClip from '../img/bg.mp4';
import '../css/AppHeaderBar.css';

function AppHeaderBar() {
    return (
        <div className="root">
            <AppBar position="fixed" className="appBar">
                <Toolbar className="toolBar">
                    <div >
                        <video id = "background-video" className="background-video-container" loop autoPlay muted>
                            <source src={videoClip} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>


                    <IconButton edge="start" className="menuButton" aria-label="menu">
                        <img src={Logo} alt="Logo" className="logo" />
                    </IconButton>

                    <Typography variant="h6" className="title">
                        Memo Maker 0.3
                    </Typography>
                    
                    
                </Toolbar>

            </AppBar>
        </div>
    );
}

export default AppHeaderBar;
