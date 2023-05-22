export interface Root {
    creatingLibrary: CreatingLibrary
    media: Media
  }
  
  export interface CreatingLibrary {
    name: string
    version: string
    url: string
  }
  
  export interface Media {
    "@ref": string
    track: Track[]
  }
  
  export interface Track {
    "@type": string
    VideoCount?: string
    AudioCount?: string
    Format: string
    Format_Profile?: string
    CodecID: string
    CodecID_Compatible?: string
    Duration: string
    OverallBitRate_Mode?: string
    FrameRate: string
    FrameCount: string
    StreamSize: string
    HeaderSize?: string
    DataSize?: string
    IsStreamable?: string
    Encoded_Date: string
    Tagged_Date: string
    Encoded_Application?: string
    StreamOrder?: string
    ID?: string
    Format_Level?: string
    Format_Settings_CABAC?: string
    Format_Settings_RefFrames?: string
    BitRate?: string
    Width?: string
    Width_Original?: string
    Height?: string
    Stored_Width?: string
    Sampled_Width?: string
    Sampled_Height?: string
    PixelAspectRatio?: string
    DisplayAspectRatio?: string
    Rotation?: string
    FrameRate_Mode?: string
    ColorSpace?: string
    ChromaSubsampling?: string
    BitDepth?: string
    ScanType?: string
    Language?: string
    colour_description_present?: string
    colour_description_present_Source?: string
    colour_range?: string
    colour_range_Source?: string
    colour_primaries?: string
    colour_primaries_Source?: string
    transfer_characteristics?: string
    transfer_characteristics_Source?: string
    matrix_coefficients?: string
    matrix_coefficients_Source?: string
    extra?: Extra
    Format_AdditionalFeatures?: string
    BitRate_Mode?: string
    Channels?: string
    ChannelPositions?: string
    ChannelLayout?: string
    SamplesPerFrame?: string
    SamplingRate?: string
    SamplingCount?: string
    Compression_Mode?: string
  }
  
  export interface Extra {
    CodecConfigurationBox: string
  }
  