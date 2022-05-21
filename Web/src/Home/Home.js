import { useTheme } from "@emotion/react";
import { Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const Home = () => {
    const theme = useTheme();

    const ContentCard = ({content, title, subTitle, action}) => (
        <Card sx={{ width: { md: "30%", xs: "80%" }, mb: "3%"}}>
            <CardContent>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="gradient">
                    <Typography variant="h10" color="text.secondary" gutterBottom>
                        {subTitle}
                    </Typography>
                </Typography>
                <br/>
                {content}
            </CardContent>
        </Card>
    )

    const cards = [{
        title: "About Us",
        subTitle: "Welcome to Bilco Industries",
        content: "Bilco Industries is the officially unofficial website of a company that doesn't exist. We make websites (like this one) from our HQ in West Yorkshire, our glorious leader, sole employee and the person writing this is known only by his online alias Time Travelling Toaster. He can usually be found in his natural habitat, a darkened room lit only by an excessive amount of screens and enough strobing LEDs to give most people a seizure.",
        action: () => {}
    }, {
        title: "What's the point of all this?",
        subTitle: "That's a good question, glad you asked",
        content: "Mainly we just make things that we are useful to us or that we think are interesting, currently there a few legacy projects that we are working on porting over to React to be hosted on this site, including a peer to peer anonymous messaging protocol known as Gecho and a Blackjack card counting trainer that we've been working on in various forms for years.",
        action: () => {}
    },
    {
        title: "Are there any other projects?",
        subTitle: "Yes, but most of them aren't public",
        content: "We have a a few other projects that are in various states of completion, some of them can be found on this very site if you know where to look, currently there is a semi working Blackjack game and a sweepstake generator. If you're inteerested in hiring us for some contract work please email TimeTravellingToaster@gmail.com (That's not a real email address but it will be one day). We specialise in all things JavaScript and C#, from React and React Native to background services in .Net and NodeJs we can do it all. We can even Handle deployment of our services to Linux and Windows servers.",
        action: () => {}
    }];

    return (
        <>
            <Box sx={{ textAlign: "center" }} >
                <Typography variant="h3" 
                    noWrap
                    sx={{ display: {xs: "block", md: "none" }}}
                >
                    <Typography variant="gradient">
                        Bilco Industries 
                    </Typography>
                </Typography>
                <Typography variant="h1" 
                    noWrap
                    sx={{ display: {md: "block", xs: "none" }}}
                >
                    <Typography variant="gradient">
                        Bilco Industries 
                    </Typography>
                </Typography>
            </Box>
            <Box display="flex" flexDirection={"row"} justifyContent={"space-evenly"} flexWrap="wrap">
                {
                    cards.map(({ title, subTitle, content, action}) => 
                        <ContentCard
                            key={title}
                            title={title}
                            subTitle={subTitle}
                            content={content}
                            action={action}
                        />
                    )
                }
            </Box>
        </>
    )
}

export default Home;