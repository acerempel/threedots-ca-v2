#!/usr/bin/env stack
-- stack --resolver lts-17.2 script --optimize --package shake --package optparse-applicative --package bytestring --package directory
{-# LANGUAGE MultiWayIf, TypeFamilies,
    DeriveGeneric, DeriveAnyClass, DerivingStrategies #-}
module Main (main) where

import Options.Applicative hiding (action)
import Development.Shake
import Development.Shake.FilePath
import Development.Shake.Rule
import Development.Shake.Classes
import Control.Monad (when)
import GHC.Generics (Generic)
import Data.ByteString (ByteString)
import qualified System.Directory as IO

main :: IO ()
main = do
  options <- execParser cli
  shake (makeShakeOptions options) $ build options

makeShakeOptions :: Options -> ShakeOptions
makeShakeOptions options =
  shakeOptions
    { shakeRebuild = if rebuildAll options then [(RebuildNow, "**/*")] else []
    , shakeTimings = timings options
    , shakeVerbosity = verbosity options
    , shakeVersion = "3"
    }

rollupConfig = "rollup.config.js"
yarnLockfile = "yarn.lock"
assetSourceDirectory = "resources"
assetOutputDirectory = "public"
siteOutputDirectory = "storage/app/static"
jsSubdirectory = "js"
scssSubdirectory = "sass"
mainScssFile = "main.scss"
cssFile = assetOutputDirectory </> "css/main.css"
jsBundle = assetOutputDirectory </> "js/main.js"

data EnvQ = EnvQ
  deriving stock ( Eq, Show, Generic )
  deriving anyclass ( Hashable, Binary, NFData )

type instance RuleResult EnvQ = Mode

build :: Options -> Rules ()
build options = do

  addBuiltinRule noLint noIdentity runSiteQ

  action $ do
    let realTarget t =
          case t of
            "js" -> need [jsBundle]
            "css" -> need [cssFile]
            "ssg" -> apply1 (SiteQ (mode options))
    let realTargets = map realTarget (targets options)
    parallel realTargets

  needEnv <- addOracle $ \EnvQ -> return $
    if "ssg" `elem` targets options then Production else mode options

  jsBundle %> \_ -> do
    let jsDirectory = assetSourceDirectory </> jsSubdirectory
    jsFiles <- getDirectoryFiles jsDirectory ["*.js", "*.ts"]
    need $ rollupConfig : yarnLockfile : map (jsDirectory </>) jsFiles
    env <- needEnv EnvQ
    let envString = case env of
                      Development -> "development"
                      Production -> "production"
    cmd_ (UserCommand "rollup -c") (AddEnv "NODE_ENV" envString) "yarn run rollup -c"

  yarnLockfile %> \_ -> do
    need ["package.json"]
    cmd_ (UserCommand "install JS dependencies") "yarn install"

  cssFile %> \_ -> do
    scssFiles <- getDirectoryFiles "" [assetSourceDirectory </> scssSubdirectory </> "**/*.scss"]
    need scssFiles
    let mainScssPath = assetSourceDirectory </> scssSubdirectory </> mainScssFile
    cmd_ "sass" mainScssPath cssFile "--embed-sources"
    env <- needEnv EnvQ
    when (env == Production) $ do
      cmd_ "yarn run postcss" cssFile "--replace --map --env production"

newtype SiteQ = SiteQ Mode
  deriving stock ( Eq, Show, Generic )
  deriving anyclass ( Hashable, Binary, NFData )

data Mode = Development | Production
  deriving stock ( Eq, Show, Generic )
  deriving anyclass ( Hashable, Binary, NFData )

runSiteQ :: SiteQ -> Maybe ByteString -> RunMode -> Action (RunResult ())
runSiteQ (SiteQ _buildMode) _mbStored runMode = do

  let sourceFileExtensions =
        ["html", "yaml", "yml", "md", "css", "md"]
  let sourceDirectories =
        [assetSourceDirectory </> "views", assetSourceDirectory </> "blueprints", "content"]
  let sourceFilePatterns =
        [ dir </> "**/*" <.> ext
        | dir <- sourceDirectories
        , ext <- sourceFileExtensions ]
  inputFiles <- getDirectoryFiles "" sourceFilePatterns
  need $ jsBundle : cssFile : inputFiles

  outDirExists <- liftIO $ IO.doesDirectoryExist siteOutputDirectory

  if | not outDirExists -> rebuild
     | RunDependenciesChanged <- runMode -> rebuild
     | otherwise -> don'tRebuild

 where
  rebuild = do
    cmd_ (UserCommand "ssg") "php please ssg:generate"
    return $ RunResult ChangedRecomputeDiff mempty ()

  don'tRebuild =
    return $ RunResult ChangedNothing mempty ()

type instance RuleResult SiteQ = ()

data Options = Options
  { targets :: [String]
  , rebuildAll :: Bool
  , timings :: Bool
  , mode :: Mode
  , verbosity :: Verbosity
  }

optionsParser :: Parser Options
optionsParser = Options
  <$> many (strArgument (metavar "TARGET" <> help "Targets to build"))
  <*> switch (long "rebuild-all" <> short 'R' <> help "Rebuild everything regardless of whether dependencies have changed")
  <*> switch (long "timings" <> short 't' <> help "Print timings of internal operations after completion")
  <*> (flag' Development (long "development" <> short 'd' <> help "Build in development mode (the default)")
      <|> flag' Production (long "production" <> short 'p' <> help "Build in production mode")
      <|> pure Development)
  <*> (flag' Warn (long "quiet" <> short 'q' <> help "Print only errors and warnings")
      <|> flag' Verbose (long "verbose" <> short 'v' <> help "Print various additional messages")
      <|> flag' Silent (long "silent" <> short 's' <> help "Print nothing")
      <|> pure Info)

cli :: ParserInfo Options
cli = info (optionsParser <**> helper) $ fullDesc <> progDesc "Build threedots.ca"
