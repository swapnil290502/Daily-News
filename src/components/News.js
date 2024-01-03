import React, { useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0);
    
    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const update = async (pageNo) => {
        props.setProgress(10);
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page= ${page + pageNo} &pageSize=${props.pageSize}`;
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(40);
        let parsedData = await data.json();
        props.setProgress(70);
        setArticles(parsedData.articles);
        setPage(page+pageNo);
        setTotalResults(parsedData.totalResults);
        setLoading(false);
        props.setProgress(100);
    }
    
    useEffect(() => {
        document.title = `${capitalize(props.category)} - DailyNews`;
        update(0);
        // eslint-disable-next-line
    }, [])


    const fetchMoreData = async () => {
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page= ${page+1} &pageSize=${props.pageSize}`;
        setPage(page+1);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults);
        setLoading(false);
    }

    return (
      <div>
        <div className="container my-3">
            <h1 className="text-center" style={{margin: "35px 0px", marginTop: "90px"}}>DailyNews - Top {capitalize(props.category)} Headlines</h1> 
            {loading && <Spinner />}

            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row">
                        {articles.map((element) => {
                            return (
                            <div className="col-md-4" key={element.url}>
                                <NewsItem
                                title={element.title ? element.title: ""}
                                description={element.description?element.description:""}
                                imageUrl={element.urlToImage?element.urlToImage:"https://static.toiimg.com/thumb/msid-90214965,width-1070,height-580,imgsize-37684,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg"}
                                newsUrl={element.url} author={element.author?element.author:"Unknown"} date={element.publishedAt} badge = {element.source.name}
                                />
                            </div>
                            );
                        })}   
                    </div>
                </div>
            </InfiniteScroll> 
            {/* <div className="cointainer d-flex justify-content-between">
                <button disabled={page <=1 } type="button" className="btn btn-dark" onClick={() => {update(-1);}}> &larr; Previous</button>
                <button disabled={page + 1 > Math.ceil(totalResults/props.pageSize)} type="button" className="btn btn-dark" onClick={() => {update(1);}}>Next &rarr; </button>
            </div> */}
        </div>
      </div>
    );
}

News.defualtProps = {
    country : "in",
    pageSize: 9,
    category: "general"
}
News.propTypes = {
    country : PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
}

export default News

