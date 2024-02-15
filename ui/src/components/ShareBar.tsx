import {
  XIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";

const ShareBar = (props: { shareUrl: string; title: string }) => {
  return (
    <div className="flex justify-end left-0 pt-5">
      <div className="px-2">
        <FacebookShareButton url={props.shareUrl}>
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
      </div>
      <div className="px-2">
        <TwitterShareButton
          url={props.shareUrl}
          title={props.title}
          className="Demo__some-network__share-button"
        >
          <XIcon size={32} round />
        </TwitterShareButton>
      </div>
      <div className="px-2">
        <LinkedinShareButton
          url={props.shareUrl}
          className="Demo__some-network__share-button"
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </div>
      <div className="px-2">
        <WhatsappShareButton
          url={props.shareUrl}
          title={props.title}
          separator=":: "
          className="Demo__some-network__share-button"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    </div>
  );
};
export default ShareBar;
